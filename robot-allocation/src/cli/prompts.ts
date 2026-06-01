import * as readline from 'node:readline/promises';
import { RobotInventory } from '../domain/allocation-types';
import { ROBOT_CATEGORIES } from '../domain/robots';
import { c } from './colors';

export type InventoryAndHours = {
  inventory: RobotInventory;
  hours: number;
};

export type ReadInputResult =
  | { status: 'exit' }
  | { status: 'retry' }
  | { status: 'ok'; data: InventoryAndHours };

function readInt(line: string, min: number): number | null {
  const n = Number(line.trim());
  return Number.isInteger(n) && n >= min ? n : null;
}

function isExit(line: string): boolean {
  return line.trim().toLowerCase() === 'exit';
}

export async function readInventoryAndHours(
  rl: readline.Interface
): Promise<ReadInputResult> {
  console.log(c.prompt('Enter number of robots available:'));

  const inventory = {} as RobotInventory;
  for (const robotType of ROBOT_CATEGORIES) {
    const line = await rl.question(c.label(`${robotType}: `));
    if (isExit(line)) return { status: 'exit' };

    const count = readInt(line, 0);
    if (count === null) {
      console.log(c.error('Error: Robot counts must be non-negative integers.'));
      return { status: 'retry' };
    }
    inventory[robotType] = count;
  }

  const hoursLine = await rl.question(c.prompt('\nEnter client work hours: '));
  if (isExit(hoursLine)) return { status: 'exit' };

  const hours = readInt(hoursLine, 1);
  if (hours === null) {
    console.log(c.error('Error: Work hours must be a positive integer.'));
    return { status: 'retry' };
  }

  return { status: 'ok', data: { inventory, hours } };
}
