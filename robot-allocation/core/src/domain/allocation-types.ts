import { RobotCategory } from './robots';

export type RobotInventory = Record<RobotCategory, number>;
export type RobotAssignment = Record<RobotCategory, number>;

// this boundary is the success case, it means the allocation was successful
export type AllocationSuccess = {
  ok: true;
  assignment: RobotAssignment;
  hoursProvided: number;
  hoursRequested: number;
  excessHours: number;
};

// this boundary is the failure case, it means the allocation was not successful
export type AllocationFailureReason = 'NO_ROBOTS' | 'IMPOSSIBLE_CATEGORY' | 'INVALID_HOURS';

export type AllocationFailure = {
  ok: false;
  reason: AllocationFailureReason;
};

export type AllocationResult = AllocationSuccess | AllocationFailure;

export function emptyAssignment(): RobotAssignment {
  return { Bravo: 0, Charlie: 0, Delta: 0 };
}
