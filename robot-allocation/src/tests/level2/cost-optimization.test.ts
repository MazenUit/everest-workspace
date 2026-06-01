import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { allocateCostOptimization } from '../../domain/level2/allocate';

const stock = { Bravo: 2, Charlie: 3, Delta: 2 };

describe('allocateCostOptimization', () => {
  it('20 hours — 1 Charlie + 2 Delta ($11)', () => {
    const result = allocateCostOptimization(stock, 20);
    assert.equal(result.ok, true);
    if (!result.ok) return;
    assert.deepEqual(result.assignment, { Bravo: 0, Charlie: 1, Delta: 2 });
    assert.equal(result.hoursProvided, 21);
    assert.equal(result.chargingCost, 11);
  });

  it('6 hours — 2 Bravo ($4)', () => {
    const result = allocateCostOptimization(stock, 6);
    assert.equal(result.ok, true);
    if (!result.ok) return;
    assert.deepEqual(result.assignment, { Bravo: 2, Charlie: 0, Delta: 0 });
    assert.equal(result.chargingCost, 4);
  });

  it('16 hours — 2 Delta only ($8)', () => {
    const result = allocateCostOptimization(stock, 16);
    assert.equal(result.ok, true);
    if (!result.ok) return;
    assert.deepEqual(result.assignment, { Bravo: 0, Charlie: 0, Delta: 2 });
    assert.equal(result.chargingCost, 8);
  });

  it('invalid work hours', () => {
    const result = allocateCostOptimization(stock, 0);
    assert.equal(result.ok, false);
    if (result.ok) return;
    assert.equal(result.reason, 'INVALID_HOURS');
  });

  it('stock too small to meet requested hours', () => {
    const result = allocateCostOptimization({ Bravo: 1, Charlie: 0, Delta: 0 }, 100);
    assert.equal(result.ok, false);
    if (result.ok) return;
    assert.equal(result.reason, 'NO_ROBOTS');
  });
});
