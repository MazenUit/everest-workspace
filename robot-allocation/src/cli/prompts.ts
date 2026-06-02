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

export type ReadRobotCountsResult =
  | { status: 'exit' }
  | { status: 'retry' }
  | { status: 'ok'; inventory: RobotInventory };

function readInt(line: string, min: number): number | null {
  const n = Number(line.trim());
  return Number.isInteger(n) && n >= min ? n : null;
}

function isExit(line: string): boolean {
  return line.trim().toLowerCase() === 'exit';
}

export async function readRobotCounts(
  rl: readline.Interface,
  promptLabel: string
): Promise<ReadRobotCountsResult> {
  console.log(c.prompt(promptLabel));

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

  return { status: 'ok', inventory };
}

export async function readHours(
  rl: readline.Interface
): Promise<number | 'exit' | 'retry'> {
  const line = await rl.question(c.prompt('\nEnter client work hours: '));
  if (isExit(line)) return 'exit';

  const hours = readInt(line, 1);
  if (hours === null) {
    console.log(c.error('Error: Work hours must be a positive integer.'));
    return 'retry';
  }

  return hours;
}

export async function readClientHours(
  rl: readline.Interface
): Promise<number[] | 'exit' | 'retry'> {
  const line = await rl.question(c.prompt('\nEnter client work hours: '));
  if (isExit(line)) return 'exit';

  const parts = line.trim().split(/[\s,]+/).filter(Boolean);
  if (parts.length === 0) {
    console.log(c.error('Error: At least one client work hours value required.'));
    return 'retry';
  }

  const hours: number[] = [];
  for (const part of parts) {
    const n = readInt(part, 1);
    if (n === null) {
      console.log(c.error('Error: Each client work hours must be a positive integer.'));
      return 'retry';
    }
    hours.push(n);
  }

  return hours;
}

export async function readInventoryAndHours(
  rl: readline.Interface
): Promise<ReadInputResult> {
  const countsResult = await readRobotCounts(rl, 'Enter number of robots available:');
  if (countsResult.status !== 'ok') return { status: countsResult.status };

  const hoursResult = await readHours(rl);
  if (hoursResult === 'exit') return { status: 'exit' };
  if (hoursResult === 'retry') return { status: 'retry' };

  return { status: 'ok', data: { inventory: countsResult.inventory, hours: hoursResult } };
}
