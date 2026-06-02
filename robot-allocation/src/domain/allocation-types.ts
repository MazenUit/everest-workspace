import { RobotCategory } from './robots';

export type RobotInventory = Record<RobotCategory, number>;
export type RobotAssignment = Record<RobotCategory, number>;

export type AllocationFailureReason =
  | 'NO_ROBOTS'
  | 'IMPOSSIBLE_CATEGORY'
  | 'INVALID_HOURS'
  | 'INSUFFICIENT_INVENTORY';

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

// level 4 — multi-client allocation
export type ClientAllocation =
  | {
      hoursRequested: number;
      servedByActive: true;
      assignment: RobotAssignment;
      chargingCost: number;
    }
  | {
      hoursRequested: number;
      servedByActive: false;
      standbyAssignment: RobotAssignment;
      standbyCost: number;
    };

export type MultiClientResult =
  | { ok: true; allocations: ClientAllocation[] }
  | { ok: false; reason: 'INVALID_HOURS' };

// level 3 — standby activation
export type StandbyActivationSuccess = {
  ok: true;
  activeCapacity: number;
  hoursRequested: number;
  standbyRequired: boolean;
  standbyAssignment: RobotAssignment;
  standbyCost: number;
};

export type StandbyActivationFailure = {
  ok: false;
  reason: 'INVALID_HOURS';
};

export type StandbyActivationResult = StandbyActivationSuccess | StandbyActivationFailure;
