/**
 * Level 2 — cost optimization
 *
 * Single place for product rules. Implementation: allocate.ts, each-mix.ts, pick-cheapest.ts
 * Robot specs: ../robots.ts (Bravo 3h/$2, Charlie 5h/$3, Delta 8h/$4 per day)
 */

export const LEVEL_2_RULES = {
  goal: 'Meet client hours at the lowest total daily charging cost.',

  inputs: {
    stock: 'RobotInventory — max count per type (Bravo, Charlie, Delta)',
    hoursRequested: 'positive integer — client work hours',
  },

  validation: [
    'INVALID_HOURS — hoursRequested is not a positive integer',
    'NO_ROBOTS — total stock is 0, or no mix within stock can reach hoursRequested',
  ],

  allocation: [
    'Try every mix: for each type, count from 0 up to stock (skip the all-zero mix)',
    'Drop mixes where hoursProvided < hoursRequested',
    'Among remaining mixes, pick the lowest chargingCost (count × $/day per type, summed)',
    'Tie on cost → pick the mix with less excess hours (hoursProvided − hoursRequested)',
    'No “one robot per category” rule — e.g. 2 Delta and 0 Bravo/Charlie is valid',
  ],

  output: [
    'assignment — counts per type',
    'hoursProvided, hoursRequested, excessHours',
    'chargingCost — total $/day for the chosen mix',
  ],

  notUsedHere: [
    'IMPOSSIBLE_CATEGORY (level 1 only — needs 1+1+1 start)',
    'Starting from 1 Bravo + 1 Charlie + 1 Delta',
    'Greedy “add one robot” growth (level 1)',
  ],

  examplesStock223: [
    '20h → 0 Bravo, 1 Charlie, 2 Delta — 21h provided, $11',
    '6h → 2 Bravo, 0 Charlie, 0 Delta — $4',
    '16h → 0 Bravo, 0 Charlie, 2 Delta — $8',
  ],
} as const;
