import { RobotAssignment, RobotInventory } from '../allocation-types';
import { ROBOT_CATEGORIES, ROBOT_SPECS } from '../robots';

export function totalInventory(inventory: RobotInventory): number {
  return ROBOT_CATEGORIES.reduce((sum, cat) => sum + inventory[cat], 0);
}

// level 1 only — requires at least one of every category before allocating
export function canUseAllCategories(inventory: RobotInventory): boolean {
  return ROBOT_CATEGORIES.every((cat) => inventory[cat] >= 1);
}

export function hoursForAssignment(assignment: RobotAssignment): number {
  return ROBOT_CATEGORIES.reduce(
    (sum, cat) => sum + assignment[cat] * ROBOT_SPECS[cat].hoursPerDay,
    0
  );
}

export function chargingCostForAssignment(assignment: RobotAssignment): number {
  return ROBOT_CATEGORIES.reduce(
    (sum, cat) => sum + assignment[cat] * ROBOT_SPECS[cat].chargingCostPerDay,
    0
  );
}
