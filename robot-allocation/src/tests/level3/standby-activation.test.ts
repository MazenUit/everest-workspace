import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { activateStandby } from '../../domain/level3/allocate';

const activeFleet = { Bravo: 1, Charlie: 1, Delta: 1 }; // 3+5+8 = 16h

describe('activateStandby', () => {
  it('active capacity covers hours — no standby needed', () => {
    const result = activateStandby(activeFleet, 16);
    assert.equal(result.ok, true);
    if (!result.ok) return;
    assert.equal(result.standbyRequired, false);
    assert.equal(result.activeCapacity, 16);
    assert.equal(result.standbyCost, 0);
    assert.deepEqual(result.standbyAssignment, { Bravo: 0, Charlie: 0, Delta: 0 });
  });

  it('PDF example — gap 5h, Charlie 1 is cheapest standby ($3)', () => {
    const result = activateStandby(activeFleet, 21);
    assert.equal(result.ok, true);
    if (!result.ok) return;
    assert.equal(result.standbyRequired, true);
    assert.equal(result.activeCapacity, 16);
    assert.deepEqual(result.standbyAssignment, { Bravo: 0, Charlie: 1, Delta: 0 });
    assert.equal(result.standbyCost, 3);
  });

  it('tie on cost — less excess hours wins (Bravo×2 over Delta×1, both $4, gap 6)', () => {
    // active 1 Bravo = 3h, gap = 9 - 3 = 6
    // Bravo×2 = 6h $4, 0 excess | Delta×1 = 8h $4, 2 excess → Bravo wins
    const result = activateStandby({ Bravo: 1, Charlie: 0, Delta: 0 }, 9);
    assert.equal(result.ok, true);
    if (!result.ok) return;
    assert.deepEqual(result.standbyAssignment, { Bravo: 2, Charlie: 0, Delta: 0 });
    assert.equal(result.standbyCost, 4);
  });

  it('no active robots — standby covers the full request', () => {
    // gap = 8, cheapest: Delta×1 = 8h $4
    const result = activateStandby({ Bravo: 0, Charlie: 0, Delta: 0 }, 8);
    assert.equal(result.ok, true);
    if (!result.ok) return;
    assert.equal(result.standbyRequired, true);
    assert.deepEqual(result.standbyAssignment, { Bravo: 0, Charlie: 0, Delta: 1 });
    assert.equal(result.standbyCost, 4);
  });

  it('invalid work hours', () => {
    const result = activateStandby(activeFleet, 0);
    assert.equal(result.ok, false);
    if (result.ok) return;
    assert.equal(result.reason, 'INVALID_HOURS');
  });
});
