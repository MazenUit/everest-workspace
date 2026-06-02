/**
 * Level 4 entry — multi-client allocation.
 * @see ./rules.ts — business rules for this level
 */
import { ClientAllocation, MultiClientResult, RobotAssignment, RobotInventory } from '../allocation-types';
import { chargingCostForAssignment } from '../shared/assignment-helpers';
import { findCheapestMix } from '../shared/find-cheapest-mix';
import { ROBOT_SPECS } from '../robots';

function deduct(inventory: RobotInventory, assignment: RobotAssignment): RobotInventory {
  return {
    Bravo: inventory.Bravo - assignment.Bravo,
    Charlie: inventory.Charlie - assignment.Charlie,
    Delta: inventory.Delta - assignment.Delta,
  };
}

function standbyFor(hoursRequested: number): RobotAssignment {
  const bounds = {
    Bravo: Math.ceil(hoursRequested / ROBOT_SPECS.Bravo.hoursPerDay),
    Charlie: Math.ceil(hoursRequested / ROBOT_SPECS.Charlie.hoursPerDay),
    Delta: Math.ceil(hoursRequested / ROBOT_SPECS.Delta.hoursPerDay),
  };
  return findCheapestMix(bounds, hoursRequested)!;
}

export function allocateMultiClient(
  inventory: RobotInventory,
  clientHours: number[]
): MultiClientResult {
  if (clientHours.length === 0 || clientHours.some((h) => !Number.isInteger(h) || h <= 0)) {
    return { ok: false, reason: 'INVALID_HOURS' };
  }

  const sorted = [...clientHours].sort((a, b) => b - a);
  const allocations: ClientAllocation[] = [];
  let remaining = { ...inventory };

  for (const hours of sorted) {
    const active = findCheapestMix(remaining, hours);

    if (active !== null) {
      remaining = deduct(remaining, active);
      allocations.push({
        hoursRequested: hours,
        servedByActive: true,
        assignment: active,
        chargingCost: chargingCostForAssignment(active),
      });
    } else {
      const standby = standbyFor(hours);
      allocations.push({
        hoursRequested: hours,
        servedByActive: false,
        standbyAssignment: standby,
        standbyCost: chargingCostForAssignment(standby),
      });
    }
  }

  return { ok: true, allocations };
}
