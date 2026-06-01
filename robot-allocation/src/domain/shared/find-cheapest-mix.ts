import { RobotAssignment, RobotInventory } from '../allocation-types';
import { chargingCostForAssignment, hoursForAssignment } from './assignment-helpers';

function isCheaper(
  candidate: RobotAssignment,
  best: RobotAssignment,
  minHours: number
): boolean {
  const candidateCost = chargingCostForAssignment(candidate);
  const bestCost = chargingCostForAssignment(best);
  if (candidateCost !== bestCost) return candidateCost < bestCost;

  const candidateExtra = hoursForAssignment(candidate) - minHours;
  const bestExtra = hoursForAssignment(best) - minHours;
  return candidateExtra < bestExtra;
}

export function findCheapestMix(
  inventory: RobotInventory,
  minHours: number
): RobotAssignment | null {
  let bestPlan: RobotAssignment | null = null;

  for (let bravoCount = 0; bravoCount <= inventory.Bravo; bravoCount++) {
    for (let charlieCount = 0; charlieCount <= inventory.Charlie; charlieCount++) {
      for (let deltaCount = 0; deltaCount <= inventory.Delta; deltaCount++) {
        if (bravoCount + charlieCount + deltaCount === 0) continue;
        const mix: RobotAssignment = { Bravo: bravoCount, Charlie: charlieCount, Delta: deltaCount };
        if (hoursForAssignment(mix) < minHours) continue;
        if (bestPlan === null || isCheaper(mix, bestPlan, minHours)) {
          bestPlan = mix;
        }
      }
    }
  }

  return bestPlan;
}
