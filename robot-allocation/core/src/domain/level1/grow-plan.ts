import { RobotAssignment, RobotInventory } from '../allocation-types';
import { hoursForAssignment } from '../shared/assignment-helpers';
import { RobotCategory } from '../robots';
import {
  pickSmallestHourType,
  pickTypeWithLeastExtra,
} from './pick-next';

function addRobot(
  plan: RobotAssignment,
  robotType: RobotCategory
): RobotAssignment {
  return { ...plan, [robotType]: plan[robotType] + 1 };
}

// loop: add robots until hours provided >= hours wanted
export function growUntilEnoughHours(
  plan: RobotAssignment,
  stock: RobotInventory,
  hoursWanted: number
): RobotAssignment {
  let current = plan;
  while (hoursForAssignment(current) < hoursWanted) {
    const byExtra = pickTypeWithLeastExtra(current, stock, hoursWanted);
    if (byExtra !== null) {
      current = addRobot(current, byExtra);
      continue;
    }
    const bySize = pickSmallestHourType(current, stock);
    if (bySize === null) break;
    current = addRobot(current, bySize);
  }
  return current;
}
