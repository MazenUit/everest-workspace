/**
 * Level 2 entry — cost optimization.
 * @see ./rules.ts — business rules for this level
 */
import {
  CostOptimizationResult,
  RobotAssignment,
  RobotInventory,
} from '../allocation-types';
import {
  chargingCostForAssignment,
  hoursForAssignment,
  totalInventory,
} from '../shared/assignment-helpers';
import { eachPossibleMix } from './each-mix';
import { cheaperPlan } from './pick-cheapest';

export function allocateCostOptimization(
  stock: RobotInventory,
  hoursRequested: number
): CostOptimizationResult {
  if (!Number.isInteger(hoursRequested) || hoursRequested <= 0) {
    return { ok: false, reason: 'INVALID_HOURS' };
  }
  if (totalInventory(stock) === 0) {
    return { ok: false, reason: 'NO_ROBOTS' };
  }

  let bestPlan: RobotAssignment | null = null;

  for (const candidate of eachPossibleMix(stock)) {
    if (hoursForAssignment(candidate) < hoursRequested) continue;
    if (bestPlan === null || cheaperPlan(candidate, bestPlan, hoursRequested)) {
      bestPlan = candidate;
    }
  }

  if (bestPlan === null) {
    return { ok: false, reason: 'NO_ROBOTS' };
  }

  const hoursProvided = hoursForAssignment(bestPlan);

  return {
    ok: true,
    assignment: bestPlan,
    hoursProvided,
    hoursRequested,
    excessHours: hoursProvided - hoursRequested,
    chargingCost: chargingCostForAssignment(bestPlan),
  };
}
