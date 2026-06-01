import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { ROBOT_SPECS } from '../domain/robots';

describe('robot specs', () => {
  it('matches EverBot table', () => {
    assert.equal(ROBOT_SPECS.Bravo.hoursPerDay, 3);
    assert.equal(ROBOT_SPECS.Bravo.chargingCostPerDay, 2);
    assert.equal(ROBOT_SPECS.Charlie.hoursPerDay, 5);
    assert.equal(ROBOT_SPECS.Charlie.chargingCostPerDay, 3);
    assert.equal(ROBOT_SPECS.Delta.hoursPerDay, 8);
    assert.equal(ROBOT_SPECS.Delta.chargingCostPerDay, 4);
  });
});
