import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { calculateStorageCharge } from '../domain/storage-charge';

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
});
