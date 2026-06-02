/**
 * Level 4 — multi-client allocation
 *
 * Single place for product rules. Implementation: allocate.ts
 * Reuses: shared/find-cheapest-mix.ts (same as level 2 and level 3)
 */

export const LEVEL_4_RULES = {
  goal: 'Serve multiple clients from a shared active fleet; fall back to unlimited standby when the fleet runs dry.',

  inputs: {
    inventory: 'RobotInventory — active fleet shared across all clients',
    clientHours: 'number[] — each client\'s requested hours (comma or space separated in CLI)',
  },

  validation: [
    'INVALID_HOURS — any client hours value is not a positive integer',
  ],

  allocation: [
    'Sort clients by hours descending — highest hours get first pick of active robots',
    'For each client: try findCheapestMix on the remaining active inventory',
    'If a mix is found: deduct those robots from the inventory, mark as served by active',
    'If no mix fits: serve from unlimited standby warehouse (level 3 approach, full hours)',
    'Robots used for one client are unavailable for the next (no reuse)',
  ],

  output: [
    'One ClientAllocation per client, in sorted order',
    'servedByActive:true — assignment + chargingCost',
    'servedByActive:false — standbyAssignment + standbyCost',
  ],
} as const;
