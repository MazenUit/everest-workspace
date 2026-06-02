import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { allocateCategoryDistribution } from '../domain/level1/allocate';
import { allocateCostOptimization } from '../domain/level2/allocate';
import { activateStandby } from '../domain/level3/allocate';
import { allocateMultiClient } from '../domain/level4/allocate';

const fullStock = { Bravo: 2, Charlie: 2, Delta: 2 };
const emptyStock = { Bravo: 0, Charlie: 0, Delta: 0 };
const activeFleet = { Bravo: 1, Charlie: 1, Delta: 1 };

describe('Error: No robots available for assignment', () => {
  it('level 1 — zero inventory', () => {
    const result = allocateCategoryDistribution(emptyStock, 10);
    assert.equal(result.ok, false);
    if (result.ok) return;
    assert.equal(result.reason, 'NO_ROBOTS');
  });

  it('level 2 — zero inventory', () => {
    const result = allocateCostOptimization(emptyStock, 10);
    assert.equal(result.ok, false);
    if (result.ok) return;
    assert.equal(result.reason, 'NO_ROBOTS');
  });
});

describe('Error: Unable to allocate at least one robot from each category', () => {
  it('level 1 — missing Charlie', () => {
    const result = allocateCategoryDistribution({ Bravo: 1, Charlie: 0, Delta: 1 }, 10);
    assert.equal(result.ok, false);
    if (result.ok) return;
    assert.equal(result.reason, 'IMPOSSIBLE_CATEGORY');
  });

  it('level 1 — only one category available', () => {
    const result = allocateCategoryDistribution({ Bravo: 5, Charlie: 0, Delta: 0 }, 10);
    assert.equal(result.ok, false);
    if (result.ok) return;
    assert.equal(result.reason, 'IMPOSSIBLE_CATEGORY');
  });
});

describe('Error: Work hours must be a positive integer', () => {
  it('level 1 — zero hours', () => {
    const result = allocateCategoryDistribution(fullStock, 0);
    assert.equal(result.ok, false);
    if (result.ok) return;
    assert.equal(result.reason, 'INVALID_HOURS');
  });

  it('level 1 — negative hours', () => {
    const result = allocateCategoryDistribution(fullStock, -8);
    assert.equal(result.ok, false);
    if (result.ok) return;
    assert.equal(result.reason, 'INVALID_HOURS');
  });

  it('level 2 — zero hours', () => {
    const result = allocateCostOptimization(fullStock, 0);
    assert.equal(result.ok, false);
    if (result.ok) return;
    assert.equal(result.reason, 'INVALID_HOURS');
  });

  it('level 3 — zero hours', () => {
    const result = activateStandby(activeFleet, 0);
    assert.equal(result.ok, false);
    if (result.ok) return;
    assert.equal(result.reason, 'INVALID_HOURS');
  });

  it('level 4 — zero hours in list', () => {
    const result = allocateMultiClient(fullStock, [0]);
    assert.equal(result.ok, false);
    if (result.ok) return;
    assert.equal(result.reason, 'INVALID_HOURS');
  });

  it('level 4 — empty client list', () => {
    const result = allocateMultiClient(fullStock, []);
    assert.equal(result.ok, false);
    if (result.ok) return;
    assert.equal(result.reason, 'INVALID_HOURS');
  });
});

describe('Error: Available inventory cannot meet the requested work hours', () => {
  it('level 2 — robots exist but total hours below requested', () => {
    // 1 Bravo = 3h, request 100h → impossible from stock
    const result = allocateCostOptimization({ Bravo: 1, Charlie: 0, Delta: 0 }, 100);
    assert.equal(result.ok, false);
    if (result.ok) return;
    assert.equal(result.reason, 'INSUFFICIENT_INVENTORY');
  });

  it('level 2 — all robot types present but hours still insufficient', () => {
    // 1 Bravo + 1 Charlie + 1 Delta = 16h max, request 17h with no more robots
    const result = allocateCostOptimization({ Bravo: 1, Charlie: 1, Delta: 1 }, 17);
    assert.equal(result.ok, false);
    if (result.ok) return;
    assert.equal(result.reason, 'INSUFFICIENT_INVENTORY');
  });
});
