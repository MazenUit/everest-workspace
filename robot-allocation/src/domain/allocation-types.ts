import { RobotCategory } from './robots';

export type RobotInventory = Record<RobotCategory, number>;
export type RobotAssignment = Record<RobotCategory, number>;

export type AllocationFailureReason =
  | 'NO_ROBOTS'
  | 'IMPOSSIBLE_CATEGORY'
  | 'INVALID_HOURS';

export type AllocationFailure = {
  ok: false;
  reason: AllocationFailureReason;
};

export type AllocationSuccess = {
  ok: true;
  assignment: RobotAssignment;
  hoursProvided: number;
  hoursRequested: number;
  excessHours: number;
};

export type AllocationResult = AllocationSuccess | AllocationFailure;

export type CostOptimizationSuccess = AllocationSuccess & {
  chargingCost: number;
};

export type CostOptimizationResult = CostOptimizationSuccess | AllocationFailure;

export function emptyAssignment(): RobotAssignment {
  return { Bravo: 0, Charlie: 0, Delta: 0 };
}
