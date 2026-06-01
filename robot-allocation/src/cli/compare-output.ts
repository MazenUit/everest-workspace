import { buildInsight } from '../domain/compare/insight';
import { buildCompareMetrics, LevelCompareInput } from '../domain/compare/metrics';
import { c } from './colors';
import { printLevel2Result, printResult } from './output';

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
      console.log(
        c.value(
          'Level 1 could not allocate at least one robot per category; level 2 can optimize cost without that rule.'
        )
      );
    }
    return;
  }

  if (!level2.ok) {
    printLevel2Result(level2);
    return;
  }

  printCostComparison(input);
}
