import * as readline from 'node:readline/promises';
import { stdin, stdout } from 'node:process';
import { runCompare } from '../services/compare';
import { runLevel1 } from '../services/level-1';
import { runLevel2 } from '../services/level-2';
import { runLevel3 } from '../services/level-3';
import { runLevel4 } from '../services/level-4';
import { buildSummary } from '../domain/level4/summary';
import { c } from './colors';
import {
  printAllocationSummary,
  printCostComparison,
  printCompareResult,
  printLevel2Result,
  printLevel3Result,
  printLevel4Result,
  printResult,
} from './output';
import { readClientHours, readHours, readInventoryAndHours, readRobotCounts } from './prompts.js';

type SessionTick = (rl: readline.Interface) => Promise<'exit' | 'next'>;

async function runSession(banner: string, tick: SessionTick): Promise<void> {
  const rl = readline.createInterface({ input: stdin, output: stdout });
  try {
    console.log(c.prompt(`\n${banner}\n`));
    console.log(c.hint('Type exit at any prompt to end the session.\n'));
    while (true) {
      const signal = await tick(rl);
      if (signal === 'exit') break;
    }
  } finally {
    rl.close();
  }
}

export function runCli(level: 1 | 2): Promise<void> {
  return runSession(`EverBot — Level ${level}`, async (rl) => {
    const read = await readInventoryAndHours(rl);
    if (read.status === 'exit') return 'exit';
    if (read.status === 'retry') return 'next';

    const { inventory, hours } = read.data;
    console.log('');

    if (level === 1) {
      printResult(runLevel1(inventory, hours));
    } else {
      const compare = runCompare(inventory, hours);
      printLevel2Result(compare.level2);
      if (compare.level1.ok && compare.level2.ok) {
        console.log('');
        printCostComparison(compare);
      }
    }

    console.log('');
    return 'next';
  });
}

export function runCompareCli(): Promise<void> {
  return runSession('Level 1 vs Level 2 Comparison', async (rl) => {
    const read = await readInventoryAndHours(rl);
    if (read.status === 'exit') return 'exit';
    if (read.status === 'retry') return 'next';

    const { inventory, hours } = read.data;
    console.log('');
    printCompareResult(runCompare(inventory, hours));
    console.log('');
    return 'next';
  });
}

export function runLevel3Cli(): Promise<void> {
  return runSession('EverBot — Level 3 (Standby Activation)', async (rl) => {
    const activeResult = await readRobotCounts(rl, 'Enter active robots:');
    if (activeResult.status === 'exit') return 'exit';
    if (activeResult.status === 'retry') return 'next';

    const hoursResult = await readHours(rl);
    if (hoursResult === 'exit') return 'exit';
    if (hoursResult === 'retry') return 'next';

    console.log('');
    printLevel3Result(runLevel3(activeResult.inventory, hoursResult));
    console.log('');
    return 'next';
  });
}

export function runLevel4Cli(): Promise<void> {
  return runSession('EverBot — Level 4 (Multi-Client Allocation)', async (rl) => {
    const countsResult = await readRobotCounts(rl, 'Enter number of robots available:');
    if (countsResult.status === 'exit') return 'exit';
    if (countsResult.status === 'retry') return 'next';

    const hoursResult = await readClientHours(rl);
    if (hoursResult === 'exit') return 'exit';
    if (hoursResult === 'retry') return 'next';

    const result = runLevel4(countsResult.inventory, hoursResult);
    console.log('');
    printLevel4Result(result);
    if (result.ok) printAllocationSummary(buildSummary(result.allocations));
    console.log('');
    return 'next';
  });
}
