/**
 * storePackage(size)
  → find smallest free locker that fits
  → if none: error
  → else: unique pickup code, mark locker busy, return ids
 */
import { Locker } from '../domain/locker';
import { Size } from '../domain/types';
import { findSmallestAvailableLocker } from '../domain/allocator';
import { generatePickupCode } from '../domain/pickup-code';
import { calculateStorageCharge } from '../domain/storage-charge';

// Each stored package has unique locker assignment
type LockerAssignment = {
  pickupCode: string;
  storedAt: Date;
};

export type StorePackageSuccess = {
  ok: true;
  lockerId: string;
  pickupCode: string;
};

export type StorePackageFailure = {
  ok: false;
  reason: 'NO_SUITABLE_LOCKER';
};


// API layer stays predictable without exceptions
export type StorePackageResult = StorePackageSuccess | StorePackageFailure;

// Retrieve ackage from locker
export type RetrievePackageSuccess = { 
   ok: true;
   lockerId: string
   storageCharge: number; 
  };

export type RetrievePackageFailure = {
    ok: false;
    reason: 'LOCKER_NOT_FOUND' | 'LOCKER_EMPTY' | 'INVALID_PICKUP';
};

export type RetrievePackageResult = RetrievePackageSuccess | RetrievePackageFailure;

export class LockerStation {
  // availability
  private lockers: Locker[];
  // each stored package has unique code
  private usedPickupCodes = new Set<string>();
  // each stored package has unique locker assignment
  private lockerAssignments = new Map<string, LockerAssignment>();
   
 
  constructor( lockers: Locker[], private readonly now: () => Date = () => new Date()) {
    this.lockers = lockers.map((locker) => ({ ...locker }));
  }


  listLockers(): Locker[] {
    return this.lockers.map((locker) => ({ ...locker }));
  }

  storePackage(packageSize: Size): StorePackageResult {
    const locker = findSmallestAvailableLocker(this.lockers, packageSize);

    if (locker === null) {
      return { ok: false, reason: 'NO_SUITABLE_LOCKER' };
    }

    const pickupCode = this.createUniquePickupCode();
    locker.isAvailable = false;

    this.lockerAssignments.set(locker.id, {
      pickupCode,
      storedAt: this.now(),
    });

    return {
      ok: true,
      lockerId: locker.id,
      pickupCode,
    };
  }

  retrievePackage(lockerId: string, pickupCode: string,  retrievedAt?: Date): RetrievePackageResult {
    const locker = this.lockers.find((l) => l.id === lockerId);
    if (!locker) {
      return { ok: false, reason: 'LOCKER_NOT_FOUND' };
    }
    if (locker.isAvailable) {
      return { ok: false, reason: 'LOCKER_EMPTY' };
    }
    const assignment = this.lockerAssignments.get(lockerId);
    if (!assignment || assignment.pickupCode !== pickupCode) {
      return { ok: false, reason: 'INVALID_PICKUP' };
    }
 
    // this forces the retrieve time to be the same as the stored time for testing
    const pickupTime = retrievedAt ?? this.now();

    const storageCharge = calculateStorageCharge(
      assignment.storedAt,
      pickupTime
    );
    
    locker.isAvailable = true;
    this.lockerAssignments.delete(lockerId);
    this.usedPickupCodes.delete(pickupCode);
    return { ok: true, lockerId, storageCharge };
  }
  
  // Mark the locker as busy and create a unique pickup code (one package per locker)
  private createUniquePickupCode(): string {
    let code = generatePickupCode();
    while (this.usedPickupCodes.has(code)) {
      code = generatePickupCode();
    }
    this.usedPickupCodes.add(code);
    return code;
  }
}

