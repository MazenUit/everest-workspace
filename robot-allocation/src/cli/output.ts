import { buildInsight } from '../domain/compare/insight';
import { buildCompareMetrics, LevelCompareInput } from '../domain/compare/metrics';
import {
  AllocationResult,
  CostOptimizationResult,
  MultiClientResult,
  RobotAssignment,
  StandbyActivationResult,
} from '../domain/allocation-types';
import { ROBOT_CATEGORIES, ROBOT_SPECS } from '../domain/robots';
import { c } from './colors';

const ERRORS: Record<string, string> = {
  NO_ROBOTS: 'Error: No robots available for assignment.',
  IMPOSSIBLE_CATEGORY:
    'Error: Unable to allocate at least one robot from each category with the available inventory.',
  INVALID_HOURS: 'Error: Work hours must be a positive integer.',
  INSUFFICIENT_INVENTORY:
    'Error: Available inventory cannot meet the requested work hours.',
};

function printAssignment(title: string, assignment: RobotAssignment): void {
  console.log(c.prompt(title));
  for (const cat of ROBOT_CATEGORIES) {
    console.log(c.value(`${cat}: ${assignment[cat]}`));
  }
}

export function printResult(result: AllocationResult): void {
  if (!result.ok) { console.log(c.error(ERRORS[result.reason])); return; }
  printAssignment('Robot Assignment', result.assignment);
  console.log(c.value(`Total Work Hours Provided: ${result.hoursProvided}`));
  console.log(c.value(`Client Work Hours Requested: ${result.hoursRequested}`));
}

export function printLevel2Result(result: CostOptimizationResult): void {
  if (!result.ok) { console.log(c.error(ERRORS[result.reason])); return; }
  printAssignment('Robot Assignment', result.assignment);
  console.log(c.value(`Total Work Hours Provided: ${result.hoursProvided}`));
  console.log(c.value(`Client Work Hours Requested: ${result.hoursRequested}`));
  console.log(c.value(`Total Charging Cost: $${result.chargingCost}`));
}

export function printLevel3Result(result: StandbyActivationResult): void {
  if (!result.ok) { console.log(c.error(ERRORS[result.reason])); return; }
  console.log(c.value(`Active Robot Capacity: ${result.activeCapacity} hours`));
  console.log(c.value(`Client Work Requested: ${result.hoursRequested} hours`));
  if (!result.standbyRequired) {
    console.log(c.value('Active robots cover the requested hours. No standby required.'));
    return;
  }
  console.log(c.prompt('\nAdditional Standby Robots Required:'));
  for (const cat of ROBOT_CATEGORIES) {
    const count = result.standbyAssignment[cat];
    if (count > 0) {
      const cost = count * ROBOT_SPECS[cat].chargingCostPerDay;
      console.log(c.value(`${cat}: ${count} - cost $${cost}`));
    }
  }
}

export function printCostComparison(input: LevelCompareInput): void {
  const metrics = buildCompareMetrics(input);
  if (metrics === null) return;
  console.log(c.value(`Level 1 Cost: $${metrics.level1ChargingCost}`));
  console.log(c.value(`Level 2 Cost: $${metrics.level2ChargingCost}`));
  console.log(c.label(`Cost Difference: $${metrics.costDifference}`));
  console.log(c.prompt('\nInsight:'));
  console.log(c.value(buildInsight(metrics)));
}

export function printCompareResult(input: LevelCompareInput): void {
  const { level1, level2 } = input;

  if (!level1.ok) {
    printResult(level1);
    if (level2.ok) {
      console.log(c.value(`Level 2 Cost: $${level2.chargingCost}`));
      console.log(c.prompt('\nInsight:'));
      console.log(c.value('Level 1 could not allocate at least one robot per category; level 2 can optimize cost without that rule.'));
    }
    return;
  }

  if (!level2.ok) { printLevel2Result(level2); return; }

  printCostComparison(input);
}

export function printLevel4Result(result: MultiClientResult): void {
  if (!result.ok) { console.log(c.error(ERRORS[result.reason])); return; }

  const total = result.allocations.length;
  console.log(c.prompt(`Processing ${total} client${total !== 1 ? 's' : ''} (sorted by hours: highest first)\n`));

  result.allocations.forEach((allocation, index) => {
    console.log(c.prompt(`Client ${index + 1} — ${allocation.hoursRequested} hours`));

    if (allocation.servedByActive) {
      printAssignment('Robot Assignment (Active):', allocation.assignment);
      console.log(c.value(`Charging Cost: $${allocation.chargingCost}`));
    } else {
      console.log(c.prompt('Standby Required:'));
      for (const cat of ROBOT_CATEGORIES) {
        const count = allocation.standbyAssignment[cat];
        if (count > 0) {
          console.log(c.value(`${cat}: ${count} - cost $${count * ROBOT_SPECS[cat].chargingCostPerDay}`));
        }
      }
    }

    if (index < total - 1) console.log('');
  });
}
