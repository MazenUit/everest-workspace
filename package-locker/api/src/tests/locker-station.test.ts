import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { Size } from '../domain/types';
import { Locker } from '../domain/locker';
import { LockerStation, StorePackageSuccess } from '../services/locker-station';

function makeStation(): LockerStation {
  const lockers: Locker[] = [
    { id: 'S1', size: Size.Small, isAvailable: true },
    { id: 'M1', size: Size.Medium, isAvailable: true },
    { id: 'L1', size: Size.Large, isAvailable: true },
  ];
  return new LockerStation(lockers);
}

function expectSuccess(result: { ok: boolean }): StorePackageSuccess {
  assert.equal(result.ok, true);
  return result as StorePackageSuccess;
}

describe('LockerStation.storePackage', () => {
  it('small package goes to S1 and locker becomes busy', () => {
    const station = makeStation();
    const result = expectSuccess(station.storePackage(Size.Small));

    assert.equal(result.lockerId, 'S1');
    assert.match(result.pickupCode, /^[A-Z0-9]{6}$/);

    const s1 = station.listLockers().find((l) => l.id === 'S1');
    assert.equal(s1?.isAvailable, false);
  });

  it('large package cannot fit when only small lockers exist', () => {
    const station = new LockerStation([
      { id: 'S1', size: Size.Small, isAvailable: true },
    ]);
    const result = station.storePackage(Size.Large);

    assert.equal(result.ok, false);
    if (result.ok) return;
    assert.equal(result.reason, 'NO_SUITABLE_LOCKER');
  });

  it('two small packages use two lockers and two codes', () => {
    const station = makeStation();
    const first = expectSuccess(station.storePackage(Size.Small));
    const second = expectSuccess(station.storePackage(Size.Small));

    assert.notEqual(first.lockerId, second.lockerId);
    assert.notEqual(first.pickupCode, second.pickupCode);
  });
});