import { LevelCompareInput } from '../domain/compare/metrics';
import { RobotInventory } from '../domain/allocation-types';
import { runLevel1 } from './level-1';
import { runLevel2 } from './level-2';

/** run level 1 and level 2 on the same stock and hours. Rules: ../domain/compare/rules.ts */
export function runCompare(
  inventory: RobotInventory,
  hoursRequested: number
): LevelCompareInput {
  return {
    level1: runLevel1(inventory, hoursRequested),
    level2: runLevel2(inventory, hoursRequested),
  };
}
