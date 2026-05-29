import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { Size } from '../domain/types';
import { Locker } from '../domain/locker';
import { LockerStation } from '../services/locker-station';

function stationWithOneStored(): { station: LockerStation; lockerId: string; pickupCode: string } {
  const station = new LockerStation([
    { id: 'S1', size: Size.Small, isAvailable: true },
  ]);
  const stored = station.storePackage(Size.Small);
  assert.equal(stored.ok, true);
  if (!stored.ok) throw new Error('setup failed');
  return { station, lockerId: stored.lockerId, pickupCode: stored.pickupCode };
}

describe('LockerStation.retrievePackage', () => {
  it('frees locker when locker id and code match', () => {
    const { station, lockerId, pickupCode } = stationWithOneStored();

    const result = station.retrievePackage(lockerId, pickupCode);

    assert.equal(result.ok, true);
    const locker = station.listLockers().find((l) => l.id === lockerId);
    assert.equal(locker?.isAvailable, true);
  });

  it('rejects wrong pickup code', () => {
    const { station, lockerId } = stationWithOneStored();

    const result = station.retrievePackage(lockerId, 'WRONG1');

    assert.equal(result.ok, false);
    if (result.ok) return;
    assert.equal(result.reason, 'INVALID_PICKUP');
  });

  it('rejects unknown locker id', () => {
    const { station, pickupCode } = stationWithOneStored();

    const result = station.retrievePackage('UNKNOWN', pickupCode);

    assert.equal(result.ok, false);
    if (result.ok) return;
    assert.equal(result.reason, 'LOCKER_NOT_FOUND');
  });

  it('rejects retrieve on empty locker', () => {
    const station = new LockerStation([
      { id: 'S1', size: Size.Small, isAvailable: true },
    ]);

    const result = station.retrievePackage('S1', 'ABC123');

    assert.equal(result.ok, false);
    if (result.ok) return;
    assert.equal(result.reason, 'LOCKER_EMPTY');
  });
});