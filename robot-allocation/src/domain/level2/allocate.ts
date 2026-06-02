/**
 * Level 2 entry — cost optimization.
 * @see ./rules.ts — business rules for this level
 */
import { CostOptimizationResult, RobotInventory } from '../allocation-types';
import { chargingCostForAssignment, hoursForAssignment, totalInventory } from '../shared/assignment-helpers';
import { findCheapestMix } from '../shared/find-cheapest-mix';

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

  const bestPlan = findCheapestMix(stock, hoursRequested);

  if (bestPlan === null) {
    return { ok: false, reason: 'INSUFFICIENT_INVENTORY' };
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
