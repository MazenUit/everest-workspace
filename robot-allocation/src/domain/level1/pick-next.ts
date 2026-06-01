import { RobotAssignment, RobotInventory } from '../allocation-types';
import { hoursForAssignment } from '../shared/assignment-helpers';
import { ROBOT_CATEGORIES, ROBOT_SPECS, RobotCategory } from '../robots';

export function pickTypeWithLeastExtra(
  plan: RobotAssignment,
  stock: RobotInventory,
  hoursWanted: number
): RobotCategory | null {
  let bestType: RobotCategory | null = null;
  let leastExtra = Infinity;

  for (const robotType of ROBOT_CATEGORIES) {
    if (plan[robotType] >= stock[robotType]) continue;
    const hours = hoursForAssignment({ ...plan, [robotType]: plan[robotType] + 1 });
    if (hours >= hoursWanted) {
      const extra = hours - hoursWanted;
      if (extra < leastExtra) {
        bestType = robotType;
        leastExtra = extra;
      }
    }
  }

  return bestType;
}

export function pickSmallestHourType(
  plan: RobotAssignment,
  stock: RobotInventory
): RobotCategory | null {
  let bestType: RobotCategory | null = null;

  for (const robotType of ROBOT_CATEGORIES) {
    if (plan[robotType] >= stock[robotType]) continue;
    if (bestType === null || ROBOT_SPECS[robotType].hoursPerDay < ROBOT_SPECS[bestType].hoursPerDay) {
      bestType = robotType;
    }
  }

  return bestType;
}
