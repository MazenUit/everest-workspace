import { Locker } from '../domain/locker';
import { Size } from '../domain/types';
import { findSmallestAvailableLocker } from '../domain/allocator';
import { generatePickupCode } from '../domain/pickup-code';
import { calculateStorageCharge } from '../domain/storage-charge';
import { withTransaction } from '../infrastructure/db';
import { LockerRepository } from '../infrastructure/locker-repository';
import { PackageAssignmentRepository } from '../infrastructure/package-assignment-repository';

export type StorePackageSuccess = { ok: true; lockerId: string; pickupCode: string };
export type StorePackageFailure = { ok: false; reason: 'NO_SUITABLE_LOCKER' };
export type StorePackageResult = StorePackageSuccess | StorePackageFailure;

export type RetrievePackageSuccess = { ok: true; lockerId: string; storageCharge: number };
export type RetrievePackageFailure = {
  ok: false;
  reason: 'LOCKER_NOT_FOUND' | 'LOCKER_EMPTY' | 'INVALID_PICKUP';
};
export type RetrievePackageResult = RetrievePackageSuccess | RetrievePackageFailure;

/** Use cases: list, store, retrieve*/
export class LockerStation {
  constructor(
    private readonly lockerRepo: LockerRepository,
    private readonly assignmentRepo: PackageAssignmentRepository,
    private readonly now: () => Date = () => new Date()
  ) {}

  listLockers(): Promise<Locker[]> {
    return this.lockerRepo.listLockers();
  }

  storePackage(packageSize: Size): Promise<StorePackageResult> {
    return withTransaction(async (client) => {
      const lockers = await this.lockerRepo.listLockersForUpdate(client);
      const locker = findSmallestAvailableLocker(lockers, packageSize);
      if (locker === null) {
        return { ok: false, reason: 'NO_SUITABLE_LOCKER' };
      }

      const pickupCode = await this.createUniquePickupCode();
      const reserved = await this.lockerRepo.markUnavailable(client, locker.id);
      if (!reserved) {
        return { ok: false, reason: 'NO_SUITABLE_LOCKER' };
      }

      await this.assignmentRepo.insert(
        client,
        locker.id,
        pickupCode,
        packageSize,
        this.now()
      );

      return { ok: true, lockerId: locker.id, pickupCode };
    });
  }

  async retrievePackage(
    lockerId: string,
    pickupCode: string,
    retrievedAt?: Date
  ): Promise<RetrievePackageResult> {
    if (!(await this.lockerRepo.lockerExists(lockerId))) {
      return { ok: false, reason: 'LOCKER_NOT_FOUND' };
    }

    return withTransaction(async (client) => {
      const lockers = await this.lockerRepo.listLockersForUpdate(client);
      const locker = lockers.find((l) => l.id === lockerId);
      if (!locker) return { ok: false, reason: 'LOCKER_NOT_FOUND' };
      if (locker.isAvailable) return { ok: false, reason: 'LOCKER_EMPTY' };

      const assignment = await this.assignmentRepo.findActiveForLocker(client, lockerId);
      if (!assignment || assignment.pickupCode !== pickupCode) {
        return { ok: false, reason: 'INVALID_PICKUP' };
      }

      const pickupTime = retrievedAt ?? this.now();
      const storageCharge = calculateStorageCharge(assignment.storedAt, pickupTime);

      await this.assignmentRepo.markRetrieved(client, lockerId, pickupTime);
      await this.lockerRepo.markAvailable(client, lockerId);

      return { ok: true, lockerId, storageCharge };
    });
  }

  private async createUniquePickupCode(): Promise<string> {
    for (let i = 0; i < 10; i++) {
      const code = generatePickupCode();
      if (!(await this.assignmentRepo.isPickupCodeInUse(code))) {
        return code;
      }
    }
    throw new Error('Could not generate unique pickup code');
  }
}
