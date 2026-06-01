// maps domain results to the exact lines the challenge expects on stdout

import {
  AllocationFailureReason,
  AllocationResult,
  CostOptimizationResult,
  RobotAssignment,
} from '../domain/allocation-types';
import { ROBOT_CATEGORIES } from '../domain/robots';
import { c } from './colors';

const ERRORS: Record<AllocationFailureReason, string> = {
  NO_ROBOTS: 'Error: No robots available for assignment.',
  IMPOSSIBLE_CATEGORY:
    'Error: Unable to allocate at least one robot from each category with the available inventory.',
  INVALID_HOURS: 'Error: Work hours must be a positive integer.',
};

function printAssignment(title: string, assignment: RobotAssignment): void {
  console.log(c.prompt(title));
  for (const cat of ROBOT_CATEGORIES) {
    console.log(c.value(`${cat}: ${assignment[cat]}`));
  }
}

export function printResult(result: AllocationResult): void {
  if (!result.ok) {
    console.log(c.error(ERRORS[result.reason]));
    return;
  }

  printAssignment('Robot Assignment', result.assignment);
  console.log(c.value(`Total Work Hours Provided: ${result.hoursProvided}`));
  console.log(c.value(`Client Work Hours Requested: ${result.hoursRequested}`));
}

export function printLevel2Result(result: CostOptimizationResult): void {
  if (!result.ok) {
    console.log(c.error(ERRORS[result.reason]));
    return;
  }

  printAssignment('Robot Assignment', result.assignment);
  console.log(c.value(`Total Work Hours Provided: ${result.hoursProvided}`));
  console.log(c.value(`Client Work Hours Requested: ${result.hoursRequested}`));
  console.log(c.value(`Total Charging Cost: $${result.chargingCost}`));
}
