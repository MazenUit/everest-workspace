import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { allocateMultiClient } from '../../domain/level4/allocate';
import { buildSummary } from '../../domain/level4/summary';

describe('allocateMultiClient', () => {
  it('single client served by active inventory', () => {
    // Delta = 8h, client needs 8h — exact match
    const result = allocateMultiClient({ Bravo: 0, Charlie: 0, Delta: 1 }, [8]);
    assert.equal(result.ok, true);
    if (!result.ok) return;
    assert.equal(result.allocations.length, 1);
    const allocation = result.allocations[0];
    assert.equal(allocation.hoursRequested, 8);
    assert.equal(allocation.servedByActive, true);
    if (!allocation.servedByActive) return;
    assert.deepEqual(allocation.assignment, { Bravo: 0, Charlie: 0, Delta: 1 });
    assert.equal(allocation.chargingCost, 4);
  });

  it('clients sorted by hours — highest served first from active fleet', () => {
    // inventory: 1 Charlie (5h), 1 Delta (8h) — clients [5, 8]
    // sorted: [8, 5] → client 8h gets Delta, client 5h gets Charlie
    const result = allocateMultiClient({ Bravo: 0, Charlie: 1, Delta: 1 }, [5, 8]);
    assert.equal(result.ok, true);
    if (!result.ok) return;
    assert.equal(result.allocations.length, 2);
    assert.equal(result.allocations[0].hoursRequested, 8);
    assert.equal(result.allocations[1].hoursRequested, 5);
    assert.equal(result.allocations[0].servedByActive, true);
    assert.equal(result.allocations[1].servedByActive, true);
  });

  it('second client falls back to standby when active inventory exhausted', () => {
    // inventory: 1 Delta (8h) — clients [8, 5]
    // client 8h takes the Delta, client 5h has no active inventory → standby
    const result = allocateMultiClient({ Bravo: 0, Charlie: 0, Delta: 1 }, [8, 5]);
    assert.equal(result.ok, true);
    if (!result.ok) return;
    assert.equal(result.allocations.length, 2);
    const first = result.allocations[0];
    const second = result.allocations[1];
    assert.equal(first.servedByActive, true);
    assert.equal(second.servedByActive, false);
    if (second.servedByActive) return;
    // cheapest standby for 5h: Charlie×1 = 5h $3
    assert.deepEqual(second.standbyAssignment, { Bravo: 0, Charlie: 1, Delta: 0 });
    assert.equal(second.standbyCost, 3);
  });

  it('no active inventory — all clients go to standby', () => {
    const result = allocateMultiClient({ Bravo: 0, Charlie: 0, Delta: 0 }, [8, 3]);
    assert.equal(result.ok, true);
    if (!result.ok) return;
    assert.equal(result.allocations.length, 2);
    assert.equal(result.allocations[0].servedByActive, false);
    assert.equal(result.allocations[1].servedByActive, false);
  });

  it('standby cost minimization — cheapest mix chosen (Delta×1 cheaper than Bravo×3 for 8h)', () => {
    // gap = 8h: Delta×1 = $4, Bravo×3 = $6 → Delta wins
    const result = allocateMultiClient({ Bravo: 0, Charlie: 0, Delta: 0 }, [8]);
    assert.equal(result.ok, true);
    if (!result.ok) return;
    const allocation = result.allocations[0];
    assert.equal(allocation.servedByActive, false);
    if (allocation.servedByActive) return;
    assert.deepEqual(allocation.standbyAssignment, { Bravo: 0, Charlie: 0, Delta: 1 });
    assert.equal(allocation.standbyCost, 4);
  });

  it('invalid hours — zero', () => {
    const result = allocateMultiClient({ Bravo: 1, Charlie: 1, Delta: 1 }, [0]);
    assert.equal(result.ok, false);
    if (result.ok) return;
    assert.equal(result.reason, 'INVALID_HOURS');
  });

  it('invalid hours — negative', () => {
    const result = allocateMultiClient({ Bravo: 1, Charlie: 1, Delta: 1 }, [-5]);
    assert.equal(result.ok, false);
    if (result.ok) return;
    assert.equal(result.reason, 'INVALID_HOURS');
  });

  it('invalid hours — empty array', () => {
    const result = allocateMultiClient({ Bravo: 1, Charlie: 1, Delta: 1 }, []);
    assert.equal(result.ok, false);
    if (result.ok) return;
    assert.equal(result.reason, 'INVALID_HOURS');
  });

  it('three clients — mix of active and standby', () => {
    // inventory: 1 Bravo (3h), 1 Charlie (5h) — clients [10, 5, 3]
    // client 10h: no single mix covers 10h from {Bravo:1, Charlie:1} → standby (Charlie×2=$6 vs Delta×2=$8 vs Bravo×4=$8 ... cheapest 10h: Charlie×2=10h $6)
    // client 5h: Charlie×1 (5h $3) from remaining (Bravo:1, Charlie:1)
    // client 3h: Bravo×1 (3h $2) from remaining (Bravo:1)
    const result = allocateMultiClient({ Bravo: 1, Charlie: 1, Delta: 0 }, [5, 3, 10]);
    assert.equal(result.ok, true);
    if (!result.ok) return;
    assert.equal(result.allocations.length, 3);
    assert.equal(result.allocations[0].hoursRequested, 10);
    assert.equal(result.allocations[1].hoursRequested, 5);
    assert.equal(result.allocations[2].hoursRequested, 3);
    assert.equal(result.allocations[0].servedByActive, false);
    assert.equal(result.allocations[1].servedByActive, true);
    assert.equal(result.allocations[2].servedByActive, true);
  });
});

describe('buildSummary', () => {
  it('single active allocation — full utilization', () => {
    // Delta×1 = 8h exact, hoursRequested=8 → 100% utilization, Delta=100%
    const result = allocateMultiClient({ Bravo: 0, Charlie: 0, Delta: 1 }, [8]);
    assert.equal(result.ok, true);
    if (!result.ok) return;
    const summary = buildSummary(result.allocations);
    assert.equal(summary.totalRobotsUsed, 1);
    assert.equal(summary.totalChargingCost, 4);
    assert.equal(summary.avgUtilizationPct, 100);
    assert.equal(summary.categoryUtilizationPct.Bravo, 0);
    assert.equal(summary.categoryUtilizationPct.Charlie, 0);
    assert.equal(summary.categoryUtilizationPct.Delta, 100);
  });

  it('active + standby mix — totals and utilization', () => {
    // inventory: 1 Delta — clients [8, 5]
    // client 8h: active Delta×1 = 8h $4, 100% utilization
    // client 5h: standby Charlie×1 = 5h $3, 100% utilization
    const result = allocateMultiClient({ Bravo: 0, Charlie: 0, Delta: 1 }, [8, 5]);
    assert.equal(result.ok, true);
    if (!result.ok) return;
    const summary = buildSummary(result.allocations);
    assert.equal(summary.totalRobotsUsed, 2);
    assert.equal(summary.totalChargingCost, 7);
    assert.equal(summary.avgUtilizationPct, 100);
    // Delta: 8h/13h, Charlie: 5h/13h → 62% and 38%
    assert.equal(summary.categoryUtilizationPct.Delta, 62);
    assert.equal(summary.categoryUtilizationPct.Charlie, 38);
    assert.equal(summary.categoryUtilizationPct.Bravo, 0);
  });

  it('excess hours reduce avg utilization below 100%', () => {
    // 1 Delta = 8h, client wants 5h → utilization 5/8 = 63%
    const result = allocateMultiClient({ Bravo: 0, Charlie: 0, Delta: 1 }, [5]);
    assert.equal(result.ok, true);
    if (!result.ok) return;
    const summary = buildSummary(result.allocations);
    assert.equal(summary.avgUtilizationPct, 63);
  });

  it('category utilization reflects share of hours provided', () => {
    // Bravo×2=6h + Charlie×1=5h → total 11h
    // Bravo%: 6/11=55%, Charlie%: 5/11=45%
    const result = allocateMultiClient({ Bravo: 2, Charlie: 1, Delta: 0 }, [11]);
    assert.equal(result.ok, true);
    if (!result.ok) return;
    const summary = buildSummary(result.allocations);
    assert.equal(summary.categoryUtilizationPct.Bravo, 55);
    assert.equal(summary.categoryUtilizationPct.Charlie, 45);
    assert.equal(summary.categoryUtilizationPct.Delta, 0);
  });
});
