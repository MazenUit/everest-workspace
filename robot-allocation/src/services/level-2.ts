import { allocateCostOptimization } from '../domain/level2/allocate';
import { CostOptimizationResult, RobotInventory } from '../domain/allocation-types';

/** level 2 — cost optimization. Rules: ../domain/level2/rules.ts */
export function runLevel2(
  inventory: RobotInventory,
  hoursRequested: number
): CostOptimizationResult {
  return allocateCostOptimization(inventory, hoursRequested);
}
