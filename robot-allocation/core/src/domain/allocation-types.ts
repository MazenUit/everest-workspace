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

// level 1 success shape (hours only on the printed output)
export type AllocationSuccess = {
  ok: true;
  assignment: RobotAssignment;
  hoursProvided: number;
  hoursRequested: number;
  excessHours: number;
};

export type AllocationResult = AllocationSuccess | AllocationFailure;

// level 2 success shape — same hours fields plus charging cost
export type CostOptimizationSuccess = AllocationSuccess & {
  chargingCost: number;
};

export type CostOptimizationResult = CostOptimizationSuccess | AllocationFailure;

export function emptyAssignment(): RobotAssignment {
  return { Bravo: 0, Charlie: 0, Delta: 0 };
}
