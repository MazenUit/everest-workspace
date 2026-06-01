import { RobotAssignment, RobotInventory, emptyAssignment } from '../allocation-types';
import { ROBOT_CATEGORIES } from '../robots';

function hasAnyRobots(mix: RobotAssignment): boolean {
  return ROBOT_CATEGORIES.some((robotType) => mix[robotType] > 0);
}

// pick a count for the current type, then move on to the next type
function* growMix(
  stock: RobotInventory,
  mix: RobotAssignment,
  typeIndex: number
): Generator<RobotAssignment> {
  if (typeIndex === ROBOT_CATEGORIES.length) {
    if (hasAnyRobots(mix)) yield mix;
    return;
  }

  const robotType = ROBOT_CATEGORIES[typeIndex];
  const maxCount = stock[robotType];

  for (let count = 0; count <= maxCount; count++) {
    const nextMix = { ...mix, [robotType]: count };
    yield* growMix(stock, nextMix, typeIndex + 1);
  }
}

// try every count combo within stock (Bravo × Charlie × Delta)
export function* eachPossibleMix(
  stock: RobotInventory
): Generator<RobotAssignment> {
  yield* growMix(stock, emptyAssignment(), 0);
}
