/**
 * Level 1 entry — category distribution.
 * @see ./rules.ts — business rules for this level
 */
import {
  AllocationFailure,
  AllocationResult,
  RobotAssignment,
  RobotInventory,
  emptyAssignment,
} from '../allocation-types';
import {
  canUseAllCategories,
  hoursForAssignment,
  totalInventory,
} from '../shared/assignment-helpers';
import { ROBOT_CATEGORIES } from '../robots';
import { growUntilEnoughHours } from './grow-plan';

function failIfBadInput(
  stock: RobotInventory,
  hoursWanted: number
): AllocationFailure | null {
  if (!Number.isInteger(hoursWanted) || hoursWanted <= 0) {
    return { ok: false, reason: 'INVALID_HOURS' };
  }
  if (totalInventory(stock) === 0) {
    return { ok: false, reason: 'NO_ROBOTS' };
  }
  if (!canUseAllCategories(stock)) {
    return { ok: false, reason: 'IMPOSSIBLE_CATEGORY' };
  }
  return null;
}

// level 1 always starts with one Bravo, one Charlie, one Delta (= 16 hours)
function onePerType(): RobotAssignment {
  const plan = emptyAssignment();
  for (const robotType of ROBOT_CATEGORIES) {
    plan[robotType] = 1;
  }
  return plan;
}

export function allocateCategoryDistribution(
  stock: RobotInventory,
  hoursRequested: number
): AllocationResult {
  const fail = failIfBadInput(stock, hoursRequested);
  if (fail) return fail;

  const plan = growUntilEnoughHours(onePerType(), stock, hoursRequested);
  const hoursProvided = hoursForAssignment(plan);

  return {
    ok: true,
    assignment: plan,
    hoursProvided,
    hoursRequested,
    excessHours: hoursProvided - hoursRequested,
  };
}
