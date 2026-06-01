// Print assignment or challenge error text (stdout boundary).

import { AllocationResult, AllocationFailureReason } from '../domain/allocation-types';
import { ROBOT_CATEGORIES } from '../domain/robots';
import { c } from './colors';

// Map domain failure reasons to the exact messages reviewers expect
const ERRORS: Record<AllocationFailureReason, string> = {
  NO_ROBOTS: 'Error: No robots available for assignment.',
  IMPOSSIBLE_CATEGORY:
    'Error: Unable to allocate at least one robot from each category with the available inventory.',
  INVALID_HOURS: 'Error: Work hours must be a positive integer.',
};

export function printResult(result: AllocationResult): void {
  if (!result.ok) {
    console.log(c.error(ERRORS[result.reason]));
    return;
  }

  console.log(c.prompt('Robot Assignment'));
  for (const cat of ROBOT_CATEGORIES) {
    console.log(c.value(`${cat}: ${result.assignment[cat]}`));
  }
  console.log(c.value(`Total Work Hours Provided: ${result.hoursProvided}`));
  console.log(c.value(`Client Work Hours Requested: ${result.hoursRequested}`));
}
