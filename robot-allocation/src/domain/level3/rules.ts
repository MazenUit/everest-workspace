/**
 * Level 3 — standby robot activation
 *
 * Single place for product rules. Implementation: allocate.ts, find-standby.ts
 * Robot specs: ../robots.ts (Bravo 3h/$2, Charlie 5h/$3, Delta 8h/$4 per day)
 */

export const LEVEL_3_RULES = {
  goal: 'Activate the cheapest standby robots to cover any gap between active capacity and client hours.',

  inputs: {
    activeRobots: 'RobotAssignment — robots currently deployed (counts per type)',
    hoursRequested: 'positive integer — client work hours',
  },

  validation: [
    'INVALID_HOURS — hoursRequested is not a positive integer',
  ],

  activation: [
    'Compute activeCapacity = sum of (active[type] × hoursPerDay)',
    'If activeCapacity >= hoursRequested: standbyRequired = false, standbyCost = 0',
    'Otherwise: gap = hoursRequested − activeCapacity',
    'Warehouse is unlimited — bound search per type to ceil(gap / hoursPerDay)',
    'Try every mix within those bounds; drop mixes where hours < gap',
    'Among remaining: pick lowest chargingCost (tie → less excess hours above gap)',
  ],

  output: [
    'activeCapacity — total hours from the active fleet',
    'hoursRequested',
    'standbyRequired — true when active capacity was not enough',
    'standbyAssignment — counts per type to activate (all zero when not required)',
    'standbyCost — total $/day for the standby robots (0 when not required)',
  ],

  exampleGap5: [
    'Active 1B+1C+1D = 16h, request = 21h → gap = 5',
    'Bravo×2 covers 6h, cost $4',
    'Charlie×1 covers 5h, cost $3 ← cheapest',
    'Delta×1 covers 8h, cost $4',
    'Winner: Charlie 1 at $3',
  ],
} as const;
