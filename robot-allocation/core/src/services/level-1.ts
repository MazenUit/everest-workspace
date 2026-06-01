import { allocateCategoryDistribution } from '../domain/category-distribution';
import { AllocationResult, RobotInventory } from '../domain/allocation-types';

/** Use case: category distribution */
export function runLevel1(
  inventory: RobotInventory,
  hoursRequested: number
): AllocationResult {
  return allocateCategoryDistribution(inventory, hoursRequested);
}
