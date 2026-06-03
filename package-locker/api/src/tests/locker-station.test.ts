import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { PoolClient } from 'pg';
import { Locker } from '../domain/locker';
import { Size } from '../domain/types';
import { ActiveAssignment, PackageAssignmentRepository } from '../infrastructure/package-assignment-repository';
import { LockerRepository } from '../infrastructure/locker-repository';
import { LockerStation, TransactionRunner } from '../services/locker-station';

// Calls fn immediately with a null stand-in for PoolClient.
// Mock repos ignore the client, so this is safe for unit tests.
const fakeTransaction: TransactionRunner = (fn) =>
  fn(null as unknown as PoolClient);

class InMemoryLockerRepo implements LockerRepository {
  private lockers: Locker[];

  constructor(lockers: Locker[]) {
    this.lockers = lockers.map((l) => ({ ...l }));
  }

  async listLockers(): Promise<Locker[]> {
    return this.lockers.map((l) => ({ ...l }));
  }

  async listLockersForUpdate(_client: PoolClient): Promise<Locker[]> {
    return this.lockers.map((l) => ({ ...l }));
  }

  async markUnavailable(_client: PoolClient, lockerId: string): Promise<boolean> {
    const locker = this.lockers.find((l) => l.id === lockerId);
    if (!locker || !locker.isAvailable) return false;
    locker.isAvailable = false;
    return true;
  }

  async markAvailable(_client: PoolClient, lockerId: string): Promise<void> {
    const locker = this.lockers.find((l) => l.id === lockerId);
    if (locker) locker.isAvailable = true;
  }

  async lockerExists(lockerId: string): Promise<boolean> {
    return this.lockers.some((l) => l.id === lockerId);
  }
}

class InMemoryAssignmentRepo implements PackageAssignmentRepository {
  private assignments = new Map<string, ActiveAssignment>();
  private usedCodes = new Set<string>();

  async insert(
    _client: PoolClient,
    lockerId: string,
    pickupCode: string,
    _packageSize: Size,
    storedAt: Date
  ): Promise<void> {
    this.assignments.set(lockerId, { pickupCode, storedAt });
    this.usedCodes.add(pickupCode);
  }

  async findActiveForLocker(
    _client: PoolClient,
    lockerId: string
  ): Promise<ActiveAssignment | null> {
    return this.assignments.get(lockerId) ?? null;
  }

  async markRetrieved(_client: PoolClient, lockerId: string): Promise<void> {
    this.assignments.delete(lockerId);
  }

  async isPickupCodeInUse(pickupCode: string): Promise<boolean> {
    return this.usedCodes.has(pickupCode);
  }
}

function makeStation(
  lockers: Locker[],
  now: () => Date = () => new Date()
): { station: LockerStation; lockerRepo: InMemoryLockerRepo; assignmentRepo: InMemoryAssignmentRepo } {
  const lockerRepo = new InMemoryLockerRepo(lockers);
  const assignmentRepo = new InMemoryAssignmentRepo();
  const station = new LockerStation(lockerRepo, assignmentRepo, now, fakeTransaction);
  return { station, lockerRepo, assignmentRepo };
}

// ────────────────────────── storePackage ──────────────────────────

describe('LockerStation.storePackage', () => {
  it('returns NO_SUITABLE_LOCKER when no lockers exist', async () => {
    const { station } = makeStation([]);
    const result = await station.storePackage(Size.Small);
    assert.equal(result.ok, false);
    if (result.ok) return;
    assert.equal(result.reason, 'NO_SUITABLE_LOCKER');
  });

  it('returns NO_SUITABLE_LOCKER when all lockers are occupied', async () => {
    const { station } = makeStation([
      { id: 'S1', size: Size.Small, isAvailable: false },
    ]);
    const result = await station.storePackage(Size.Small);
    assert.equal(result.ok, false);
    if (result.ok) return;
    assert.equal(result.reason, 'NO_SUITABLE_LOCKER');
  });

  it('returns NO_SUITABLE_LOCKER when package is too large for available lockers', async () => {
    const { station } = makeStation([
      { id: 'S1', size: Size.Small, isAvailable: true },
    ]);
    const result = await station.storePackage(Size.Large);
    assert.equal(result.ok, false);
    if (result.ok) return;
    assert.equal(result.reason, 'NO_SUITABLE_LOCKER');
  });

  it('returns lockerId and pickupCode on success', async () => {
    const { station } = makeStation([
      { id: 'S1', size: Size.Small, isAvailable: true },
    ]);
    const result = await station.storePackage(Size.Small);
    assert.equal(result.ok, true);
    if (!result.ok) return;
    assert.equal(result.lockerId, 'S1');
    assert.match(result.pickupCode, /^[A-Z0-9]{6}$/);
  });

  it('picks the smallest fitting locker', async () => {
    const { station } = makeStation([
      { id: 'L1', size: Size.Large, isAvailable: true },
      { id: 'M1', size: Size.Medium, isAvailable: true },
      { id: 'S1', size: Size.Small, isAvailable: true },
    ]);
    const result = await station.storePackage(Size.Small);
    assert.equal(result.ok, true);
    if (!result.ok) return;
    assert.equal(result.lockerId, 'S1');
  });

  it('marks the locker unavailable after storing', async () => {
    const { station, lockerRepo } = makeStation([
      { id: 'S1', size: Size.Small, isAvailable: true },
    ]);
    await station.storePackage(Size.Small);
    const lockers = await lockerRepo.listLockers();
    assert.equal(lockers[0].isAvailable, false);
  });
});

// ────────────────────────── retrievePackage ──────────────────────────

describe('LockerStation.retrievePackage', () => {
  it('returns LOCKER_NOT_FOUND when lockerId does not exist', async () => {
    const { station } = makeStation([]);
    const result = await station.retrievePackage('X1', 'ABC123');
    assert.equal(result.ok, false);
    if (result.ok) return;
    assert.equal(result.reason, 'LOCKER_NOT_FOUND');
  });

  it('returns LOCKER_EMPTY when locker is available (nothing stored)', async () => {
    const { station } = makeStation([
      { id: 'S1', size: Size.Small, isAvailable: true },
    ]);
    const result = await station.retrievePackage('S1', 'ABC123');
    assert.equal(result.ok, false);
    if (result.ok) return;
    assert.equal(result.reason, 'LOCKER_EMPTY');
  });

  it('returns INVALID_PICKUP when pickup code does not match', async () => {
    const { station } = makeStation([
      { id: 'S1', size: Size.Small, isAvailable: true },
    ]);
    await station.storePackage(Size.Small);
    const result = await station.retrievePackage('S1', 'WRONG1');
    assert.equal(result.ok, false);
    if (result.ok) return;
    assert.equal(result.reason, 'INVALID_PICKUP');
  });

  it('returns correct storage charge on success', async () => {
    const storedAt = new Date('2026-01-01T10:00:00Z');
    const retrievedAt = new Date('2026-01-03T10:00:00Z'); // 2 days → charge 2
    let callCount = 0;
    const now = () => {
      callCount++;
      return callCount === 1 ? storedAt : retrievedAt;
    };
    const { station } = makeStation(
      [{ id: 'S1', size: Size.Small, isAvailable: true }],
      now
    );
    const storeResult = await station.storePackage(Size.Small);
    assert.equal(storeResult.ok, true);
    if (!storeResult.ok) return;

    const result = await station.retrievePackage('S1', storeResult.pickupCode);
    assert.equal(result.ok, true);
    if (!result.ok) return;
    assert.equal(result.storageCharge, 2);
  });

  it('marks the locker available again after retrieval', async () => {
    const { station, lockerRepo } = makeStation([
      { id: 'S1', size: Size.Small, isAvailable: true },
    ]);
    const storeResult = await station.storePackage(Size.Small);
    assert.equal(storeResult.ok, true);
    if (!storeResult.ok) return;

    await station.retrievePackage('S1', storeResult.pickupCode);
    const lockers = await lockerRepo.listLockers();
    assert.equal(lockers[0].isAvailable, true);
  });
});
