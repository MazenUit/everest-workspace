import { RobotAssignment, RobotInventory } from '../allocation-types';
import { hoursForAssignment } from '../shared/assignment-helpers';
import { ROBOT_CATEGORIES, ROBOT_SPECS, RobotCategory } from '../robots';

function hasStockLeft(
  plan: RobotAssignment,
  stock: RobotInventory,
  robotType: RobotCategory
): boolean {
  return plan[robotType] < stock[robotType];
}

function addOne(
  plan: RobotAssignment,
  robotType: RobotCategory
): RobotAssignment {
  return { ...plan, [robotType]: plan[robotType] + 1 };
}

function walkLeastExtra(
  plan: RobotAssignment,
  stock: RobotInventory,
  hoursWanted: number,
  typeIndex: number,
  bestType: RobotCategory | null,
  leastExtra: number
): RobotCategory | null {
  if (typeIndex === ROBOT_CATEGORIES.length) return bestType;

  const robotType = ROBOT_CATEGORIES[typeIndex];
  let nextType = bestType;
  let nextExtra = leastExtra;

  if (hasStockLeft(plan, stock, robotType)) {
    const hours = hoursForAssignment(addOne(plan, robotType));
    if (hours >= hoursWanted) {
      const extra = hours - hoursWanted;
      if (extra < nextExtra) {
        nextType = robotType;
        nextExtra = extra;
      }
    }
  }

  return walkLeastExtra(
    plan,
    stock,
    hoursWanted,
    typeIndex + 1,
    nextType,
    nextExtra
  );
}

export function pickTypeWithLeastExtra(
  plan: RobotAssignment,
  stock: RobotInventory,
  hoursWanted: number
): RobotCategory | null {
  return walkLeastExtra(plan, stock, hoursWanted, 0, null, Infinity);
}

function walkSmallestHour(
  plan: RobotAssignment,
  stock: RobotInventory,
  typeIndex: number,
  bestType: RobotCategory | null
): RobotCategory | null {
  if (typeIndex === ROBOT_CATEGORIES.length) return bestType;

  const robotType = ROBOT_CATEGORIES[typeIndex];
  let nextBest = bestType;

  if (hasStockLeft(plan, stock, robotType)) {
    if (
      nextBest === null ||
      ROBOT_SPECS[robotType].hoursPerDay < ROBOT_SPECS[nextBest].hoursPerDay
    ) {
      nextBest = robotType;
    }
  }

  return walkSmallestHour(plan, stock, typeIndex + 1, nextBest);
}

export function pickSmallestHourType(
  plan: RobotAssignment,
  stock: RobotInventory
): RobotCategory | null {
  return walkSmallestHour(plan, stock, 0, null);
}
