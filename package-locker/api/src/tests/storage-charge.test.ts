import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { calculateStorageCharge, daysBetween } from '../domain/storage-charge';
import { LockerStation } from '../services/locker-station';
import { Size } from '../domain/types';

describe('calculateStorageCharge', () => {
  it('day 1–5 costs X per day', () => {
    const start = new Date('2026-01-01T10:00:00Z');
    const end = new Date('2026-01-03T10:00:00Z'); // 2 days
    assert.equal(calculateStorageCharge(start, end, 1), 2);
  });

  it('day 6–10 costs 2X per day', () => {
    const start = new Date('2026-01-01T10:00:00Z');
    const end = new Date('2026-01-08T10:00:00Z'); // 7 days → 5*1 + 2*2
    assert.equal(calculateStorageCharge(start, end, 1), 9);
  });

  it('uses simulated retrieve time for charge', () => {
    const storedAt = new Date('2026-01-01T10:00:00Z');
    const retrieveAt = new Date('2026-01-08T10:00:00Z');
  
    const station = new LockerStation(
      [{ id: 'S1', size: Size.Small, isAvailable: true }],
      () => storedAt
    );
    const stored = station.storePackage(Size.Small);
    assert.equal(stored.ok, true);
    if (!stored.ok) return;
  
    const result = station.retrievePackage('S1', stored.pickupCode, retrieveAt);
    assert.equal(result.ok, true);
    if (!result.ok) return;
    assert.equal(result.storageCharge, 9);
  });
});