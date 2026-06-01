import { RobotAssignment } from '../allocation-types';
import {
  chargingCostForAssignment,
  hoursForAssignment,
} from '../shared/assignment-helpers';

// true when candidate beats current best (lower cost, or same cost and less extra hours)
export function cheaperPlan(
  candidate: RobotAssignment,
  currentBest: RobotAssignment,
  hoursWanted: number
): boolean {
  const candidateCost = chargingCostForAssignment(candidate);
  const bestCost = chargingCostForAssignment(currentBest);
  if (candidateCost !== bestCost) return candidateCost < bestCost;

  const candidateExtra = hoursForAssignment(candidate) - hoursWanted;
  const bestExtra = hoursForAssignment(currentBest) - hoursWanted;
  return candidateExtra < bestExtra;
}
