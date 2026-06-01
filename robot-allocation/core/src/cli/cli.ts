// prompts for inventory + hours, then calls the service for the chosen level

import * as readline from 'node:readline/promises';
import { stdin, stdout } from 'node:process';
import { RobotInventory } from '../domain/allocation-types';
import { ROBOT_CATEGORIES } from '../domain/robots';
import { runLevel1 } from '../services/level-1';
import { runLevel2 } from '../services/level-2';
import { c } from './colors';
import { printLevel2Result, printResult } from './output';
import { CliLevel } from './parse-level';

function readInt(line: string, min: number): number | null {
  const n = Number(line.trim());
  return Number.isInteger(n) && n >= min ? n : null;
}

function isExit(line: string): boolean {
  return line.trim().toLowerCase() === 'exit';
}

async function runRound(rl: readline.Interface, level: CliLevel): Promise<boolean> {
  console.log(c.prompt('Enter number of robots available:'));

  const inventory = {} as RobotInventory;
  for (const cat of ROBOT_CATEGORIES) {
    const line = await rl.question(c.label(`${cat}: `));
    if (isExit(line)) return false;

    const count = readInt(line, 0);
    if (count === null) {
      console.log(c.error('Error: Robot counts must be non-negative integers.'));
      return true;
    }
    inventory[cat] = count;
  }

  const hoursLine = await rl.question(c.prompt('\nEnter client work hours: '));
  if (isExit(hoursLine)) return false;

  const hours = readInt(hoursLine, 1);
  if (hours === null) {
    console.log(c.error('Error: Work hours must be a positive integer.'));
    return true;
  }

  console.log('');
  if (level === 1) {
    printResult(runLevel1(inventory, hours));
  } else {
    printLevel2Result(runLevel2(inventory, hours));
  }
  console.log('');
  return true;
}

export async function runCli(level: CliLevel): Promise<void> {
  const rl = readline.createInterface({ input: stdin, output: stdout });

  try {
    console.log(c.prompt(`\nEverBot — Level ${level}\n`));
    console.log(c.hint('Type exit at any prompt to end the session.\n'));

    while (await runRound(rl, level)) {
      // next round
    }
  } finally {
    rl.close();
  }
}
