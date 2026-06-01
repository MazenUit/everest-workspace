/**
 * Level compare — level 1 solution vs level 2 solution (same stock and hours).
 */

export const LEVEL_COMPARE_RULES = {
  goal: 'Help the company see the financial impact of level 1 vs level 2.',

  inputs: {
    stock: 'same RobotInventory as level 1 and level 2',
    hoursRequested: 'same positive integer',
  },

  stdoutWhenBothSucceed: [
    'Level 1 Cost: $…',
    'Level 2 Cost: $…',
    'Cost Difference: $… (level 1 cost − level 2 cost, shown in green)',
    'Insight: — short sentence explaining why (e.g. mandatory multi-category rule)',
  ],

  exampleInsight:
    'Level 1 strategy resulted in $1 additional cost due to mandatory usage of multiple robot categories.',

  whereItRuns: [
    'cli:level2 — full level 2 output, then cost comparison + insight',
    'cli:compare — comparison + insight only (same inputs, no EverBot level banner)',
  ],
} as const;
