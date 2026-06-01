import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { allocateCategoryDistribution } from '../../domain/level1/allocate';

const stock = { Bravo: 2, Charlie: 3, Delta: 2 };

describe('allocateCategoryDistribution', () => {
  it('16 hours — one of each category', () => {
    const result = allocateCategoryDistribution(stock, 16);
    assert.equal(result.ok, true);
    if (!result.ok) return;
    assert.deepEqual(result.assignment, { Bravo: 1, Charlie: 1, Delta: 1 });
    assert.equal(result.hoursProvided, 16);
    assert.equal(result.excessHours, 0);
  });

  it('17 hours — add Bravo for smallest excess', () => {
    const result = allocateCategoryDistribution(stock, 17);
    assert.equal(result.ok, true);
    if (!result.ok) return;
    assert.deepEqual(result.assignment, { Bravo: 2, Charlie: 1, Delta: 1 });
    assert.equal(result.hoursProvided, 19);
    assert.equal(result.excessHours, 2);
  });

  it('21 hours — add Charlie to reach exactly', () => {
    const result = allocateCategoryDistribution(stock, 21);
    assert.equal(result.ok, true);
    if (!result.ok) return;
    assert.deepEqual(result.assignment, { Bravo: 1, Charlie: 2, Delta: 1 });
    assert.equal(result.hoursProvided, 21);
    assert.equal(result.excessHours, 0);
  });

  it('24 hours — add Delta to reach exactly', () => {
    const result = allocateCategoryDistribution(stock, 24);
    assert.equal(result.ok, true);
    if (!result.ok) return;
    assert.deepEqual(result.assignment, { Bravo: 1, Charlie: 1, Delta: 2 });
    assert.equal(result.hoursProvided, 24);
    assert.equal(result.excessHours, 0);
  });

  it('no robots in inventory', () => {
    const result = allocateCategoryDistribution(
      { Bravo: 0, Charlie: 0, Delta: 0 },
      10
    );
    assert.equal(result.ok, false);
    if (result.ok) return;
    assert.equal(result.reason, 'NO_ROBOTS');
  });

  it('cannot assign one robot per category', () => {
    const result = allocateCategoryDistribution(
      { Bravo: 1, Charlie: 0, Delta: 1 },
      10
    );
    assert.equal(result.ok, false);
    if (result.ok) return;
    assert.equal(result.reason, 'IMPOSSIBLE_CATEGORY');
  });

  it('invalid work hours', () => {
    const result = allocateCategoryDistribution(stock, 0);
    assert.equal(result.ok, false);
    if (result.ok) return;
    assert.equal(result.reason, 'INVALID_HOURS');
  });
});
