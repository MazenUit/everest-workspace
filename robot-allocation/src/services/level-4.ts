import { allocateMultiClient } from '../domain/level4/allocate';
import { MultiClientResult, RobotInventory } from '../domain/allocation-types';

/** level 4 — multi-client allocation. Rules: ../domain/level4/rules.ts */
export function runLevel4(
  inventory: RobotInventory,
  clientHours: number[]
): MultiClientResult {
  return allocateMultiClient(inventory, clientHours);
}
