import { allocateCategoryDistribution } from '../domain/level1/allocate';
import { AllocationResult, RobotInventory } from '../domain/allocation-types';

/** level 1 — category distribution. Rules: ../domain/level1/rules.ts */
export function runLevel1(
  inventory: RobotInventory,
  hoursRequested: number
): AllocationResult {
  return allocateCategoryDistribution(inventory, hoursRequested);
}
