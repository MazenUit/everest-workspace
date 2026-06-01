import { CompareMetrics } from './metrics';

// challenge insight when level 1 costs more than level 2
export function buildInsight(metrics: CompareMetrics): string {
  const { costDifference } = metrics;

  if (costDifference === 0) {
    return 'Both strategies result in the same charging cost.';
  }

  if (costDifference > 0) {
    return `Level 1 strategy resulted in $${costDifference} additional cost due to mandatory usage of multiple robot categories.`;
  }

  return `Level 2 strategy resulted in $${Math.abs(costDifference)} additional cost compared to the level 1 plan.`;
}
