/**
 * Level 3 entry — standby robot activation.
 * @see ./rules.ts — business rules for this level
 */
import { RobotAssignment, StandbyActivationResult, emptyAssignment } from '../allocation-types';
import { chargingCostForAssignment, hoursForAssignment } from '../shared/assignment-helpers';
import { findCheapestMix } from '../shared/find-cheapest-mix';
import { ROBOT_SPECS } from '../robots';

export function activateStandby(
  activeRobots: RobotAssignment,
  hoursRequested: number
): StandbyActivationResult {
  if (!Number.isInteger(hoursRequested) || hoursRequested <= 0) {
    return { ok: false, reason: 'INVALID_HOURS' };
  }

  const activeCapacity = hoursForAssignment(activeRobots);

  if (activeCapacity >= hoursRequested) {
    return {
      ok: true,
      activeCapacity,
      hoursRequested,
      standbyRequired: false,
      standbyAssignment: emptyAssignment(),
      standbyCost: 0,
    };
  }

  const gap = hoursRequested - activeCapacity;

  // bound the search: max robots of each type needed if used alone to cover the gap
  const searchBounds = {
    Bravo: Math.ceil(gap / ROBOT_SPECS.Bravo.hoursPerDay),
    Charlie: Math.ceil(gap / ROBOT_SPECS.Charlie.hoursPerDay),
    Delta: Math.ceil(gap / ROBOT_SPECS.Delta.hoursPerDay),
  };

  const standby = findCheapestMix(searchBounds, gap);

  return {
    ok: true,
    activeCapacity,
    hoursRequested,
    standbyRequired: true,
    standbyAssignment: standby!,
    standbyCost: chargingCostForAssignment(standby!),
  };
}
