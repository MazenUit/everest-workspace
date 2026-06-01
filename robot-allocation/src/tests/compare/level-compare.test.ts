import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { buildInsight } from '../../domain/compare/insight';
import { buildCompareMetrics } from '../../domain/compare/metrics';
import { runCompare } from '../../services/compare';

const stock = { Bravo: 2, Charlie: 3, Delta: 2 };

describe('runCompare', () => {
  it('20 hours — $12 vs $11, $1 difference, standard insight', () => {
    const input = runCompare(stock, 20);
    assert.equal(input.level1.ok, true);
    assert.equal(input.level2.ok, true);
    if (!input.level1.ok || !input.level2.ok) return;

    const metrics = buildCompareMetrics(input);
    assert.equal(metrics?.level1ChargingCost, 12);
    assert.equal(metrics?.level2ChargingCost, 11);
    assert.equal(metrics?.costDifference, 1);
    assert.equal(
      buildInsight(metrics!),
      'Level 1 strategy resulted in $1 additional cost due to mandatory usage of multiple robot categories.'
    );
  });

  it('16 hours — level 2 cheaper than 1+1+1', () => {
    const input = runCompare(stock, 16);
    const metrics = buildCompareMetrics(input);
    assert.equal(metrics?.level1ChargingCost, 9);
    assert.equal(metrics?.level2ChargingCost, 8);
    assert.equal(metrics?.costDifference, 1);
  });

  it('missing category — level 1 fails, level 2 succeeds', () => {
    const input = runCompare({ Bravo: 1, Charlie: 0, Delta: 1 }, 10);
    assert.equal(input.level1.ok, false);
    if (input.level1.ok) return;
    assert.equal(input.level1.reason, 'IMPOSSIBLE_CATEGORY');
    assert.equal(input.level2.ok, true);
    assert.equal(buildCompareMetrics(input), null);
  });
});
