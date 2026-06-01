// Assign at least one robot per category when stock allows; minimize excess hours.

import {
  AllocationResult,
  RobotAssignment,
  RobotInventory,
  emptyAssignment,
} from './allocation-types';
import { ROBOT_CATEGORIES, ROBOT_SPECS, RobotCategory } from './robots';

function totalInventory(inventory: RobotInventory): number {
  return ROBOT_CATEGORIES.reduce((sum, cat) => sum + inventory[cat], 0);
}

function canUseAllCategories(inventory: RobotInventory): boolean {
  return ROBOT_CATEGORIES.every((cat) => inventory[cat] >= 1);
}

function hoursForAssignment(assignment: RobotAssignment): number {
  return ROBOT_CATEGORIES.reduce(
    (sum, cat) => sum + assignment[cat] * ROBOT_SPECS[cat].hoursPerDay,
    0
  );
}

// add one robot to the assignment for the given category
function addOne(
  assignment: RobotAssignment,
  category: RobotCategory
): RobotAssignment {
  return { ...assignment, [category]: assignment[category] + 1 };
}

// this is the main function that allocates the robots
export function allocateCategoryDistribution(
  inventory: RobotInventory,
  hoursRequested: number
): AllocationResult {
  if (!Number.isInteger(hoursRequested) || hoursRequested <= 0) {
    return { ok: false, reason: 'INVALID_HOURS' };
  }

  if (totalInventory(inventory) === 0) {
    return { ok: false, reason: 'NO_ROBOTS' };
  }

  if (!canUseAllCategories(inventory)) {
    return { ok: false, reason: 'IMPOSSIBLE_CATEGORY' };
  }

  // Start with one robot from each category
  let assignment = emptyAssignment();
  for (const cat of ROBOT_CATEGORIES) {
    assignment[cat] = 1;
  }

  let hoursProvided = hoursForAssignment(assignment);

  while (hoursProvided < hoursRequested) {
    let bestCategory: RobotCategory | null = null;
    let bestExcess = Infinity;

    for (const cat of ROBOT_CATEGORIES) {
      if (assignment[cat] >= inventory[cat]) continue;

      const next = addOne(assignment, cat);
      const nextHours = hoursForAssignment(next);
      // Only consider robots that meet or exceed the target
      if (nextHours < hoursRequested) continue;

      const excess = nextHours - hoursRequested;
      // Prefer smallest excess when we can reach the target
      if (excess < bestExcess) {
        bestExcess = excess;
        bestCategory = cat;
      }
    }

    if (bestCategory !== null) {
      assignment = addOne(assignment, bestCategory);
      hoursProvided = hoursForAssignment(assignment);
      continue;
    }

    // Still under target — add the smallest-hour robot available
    let grow: RobotCategory | null = null;
    for (const cat of ROBOT_CATEGORIES) {
      if (assignment[cat] >= inventory[cat]) continue;
      if (grow === null) {
        grow = cat;
        continue;
      }
      if (ROBOT_SPECS[cat].hoursPerDay < ROBOT_SPECS[grow].hoursPerDay) {
        grow = cat;
      }
    }

    if (grow === null) {
      break;
    }

    assignment = addOne(assignment, grow);
    hoursProvided = hoursForAssignment(assignment);
  }

  return {
    ok: true,
    assignment,
    hoursProvided,
    hoursRequested,
    excessHours: hoursProvided - hoursRequested,
  };
}
