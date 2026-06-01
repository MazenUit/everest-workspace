/**
 * Level 1 — category distribution
 *
 * Single place for product rules. Implementation: allocate.ts, grow-plan.ts, pick-next.ts
 * Robot specs: ../robots.ts (Bravo 3h/$2, Charlie 5h/$3, Delta 8h/$4 per day)
 */

export const LEVEL_1_RULES = {
  goal: 'Meet client hours with at least one robot per type when stock allows; minimize excess hours.',

  inputs: {
    stock: 'RobotInventory — max count per type (Bravo, Charlie, Delta)',
    hoursRequested: 'positive integer — client work hours',
  },

  validation: [
    'INVALID_HOURS — hoursRequested is not a positive integer',
    'NO_ROBOTS — total stock across all types is 0',
    'IMPOSSIBLE_CATEGORY — stock is missing at least one type (cannot place 1+1+1)',
  ],

  allocation: [
    'Start with exactly 1 Bravo, 1 Charlie, 1 Delta (16 hours before any extra robots)',
    'Never assign more of a type than listed in stock',
    'Add one robot at a time until hoursProvided >= hoursRequested',
    'Next robot: if some in-stock type reaches the target in one step, pick the one with smallest excess hours',
    'Otherwise add the in-stock type with the fewest hours per day (Bravo wins ties)',
  ],

  output: [
    'assignment — counts per type',
    'hoursProvided, hoursRequested, excessHours',
    'no chargingCost field (cost optimization is level 2 only)',
  ],

  notUsedHere: [
    'Lowest charging cost',
    'Enumerating every possible mix',
    'Plans that skip a category (after start, plan always has ≥1 of each type)',
  ],

  examplesStock223: [
    '16h → 1 Bravo, 1 Charlie, 1 Delta (16h, 0 excess)',
    '17h → 2 Bravo, 1 Charlie, 1 Delta (19h, 2 excess)',
    '21h → 1 Bravo, 2 Charlie, 1 Delta (21h, 0 excess)',
    '24h → 1 Bravo, 1 Charlie, 2 Delta (24h, 0 excess)',
  ],
} as const;
