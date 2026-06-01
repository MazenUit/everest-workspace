import { activateStandby } from '../domain/level3/allocate';
import { RobotAssignment, StandbyActivationResult } from '../domain/allocation-types';

/** level 3 — standby activation. Rules: ../domain/level3/rules.ts */
export function runLevel3(
  activeRobots: RobotAssignment,
  hoursRequested: number
): StandbyActivationResult {
  return activateStandby(activeRobots, hoursRequested);
}
