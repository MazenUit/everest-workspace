import { RobotAssignment, RobotInventory } from '../allocation-types';
import { ROBOT_CATEGORIES, ROBOT_SPECS } from '../robots';

// how many robots are in stock (all types added up)
export function totalInventory(inventory: RobotInventory): number {
  return ROBOT_CATEGORIES.reduce((sum, cat) => sum + inventory[cat], 0);
}

// level 1 only — we have at least one Bravo, Charlie, and Delta available
export function canUseAllCategories(inventory: RobotInventory): boolean {
  return ROBOT_CATEGORIES.every((cat) => inventory[cat] >= 1);
}

// sum hours from an assignment (count × hours per day for each type)
export function hoursForAssignment(assignment: RobotAssignment): number {
  return ROBOT_CATEGORIES.reduce(
    (sum, cat) => sum + assignment[cat] * ROBOT_SPECS[cat].hoursPerDay,
    0
  );
}

// sum charging cost from an assignment (count × $/day for each type)
export function chargingCostForAssignment(assignment: RobotAssignment): number {
  return ROBOT_CATEGORIES.reduce(
    (sum, cat) => sum + assignment[cat] * ROBOT_SPECS[cat].chargingCostPerDay,
    0
  );
}
