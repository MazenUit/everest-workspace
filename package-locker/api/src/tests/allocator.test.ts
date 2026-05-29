import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { Size } from '../domain/types';
import { Locker } from '../domain/locker';
import { findSmallestAvailableLocker } from '../domain/allocator';

const lockers = (): Locker[] => [
  { id: 'S1', size: Size.Small, isAvailable: true },
  { id: 'M1', size: Size.Medium, isAvailable: true },
  { id: 'L1', size: Size.Large, isAvailable: true },
];

describe('findSmallestAvailableLocker', () => {
  it('picks the smallest locker that fits', () => {
    const result = findSmallestAvailableLocker(lockers(), Size.Small);
    assert.equal(result?.id, 'S1');
  });

  it('does not pick a larger locker when a smaller one fits', () => {
    const result = findSmallestAvailableLocker(lockers(), Size.Medium);
    assert.equal(result?.id, 'M1');
  });

  it('returns null when no locker is large enough', () => {
    const onlySmall: Locker[] = [
      { id: 'S1', size: Size.Small, isAvailable: true },
    ];
    const result = findSmallestAvailableLocker(onlySmall, Size.Large);
    assert.equal(result, null);
  });

  it('skips occupied lockers', () => {
    const busy: Locker[] = [
      { id: 'S1', size: Size.Small, isAvailable: false },
      { id: 'M1', size: Size.Medium, isAvailable: true },
      { id: 'L1', size: Size.Large, isAvailable: true },
    ];
    const result = findSmallestAvailableLocker(busy, Size.Small);
    assert.equal(result?.id, 'M1');
  });

  it('returns null when every fitting locker is occupied', () => {
    const allBusy: Locker[] = [
      { id: 'S1', size: Size.Small, isAvailable: false },
      { id: 'M1', size: Size.Medium, isAvailable: false },
    ];
    const result = findSmallestAvailableLocker(allBusy, Size.Small);
    assert.equal(result, null);
  });
});