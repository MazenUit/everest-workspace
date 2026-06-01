// prompts for inventory + hours, then calls the service for level 1 or level 2

import * as readline from 'node:readline/promises';
import { stdin, stdout } from 'node:process';
import { runCompare } from '../services/compare';
import { runLevel1 } from '../services/level-1';
import { runLevel2 } from '../services/level-2';
import { printCostComparison } from './compare-output';
import { c } from './colors';
import { printLevel2Result, printResult } from './output';
import { readInventoryAndHours } from './prompts.js';
import { CliLevel } from './parse-level';

export async function runCli(level: CliLevel): Promise<void> {
  const rl = readline.createInterface({ input: stdin, output: stdout });

  try {
    console.log(c.prompt(`\nEverBot — Level ${level}\n`));
    console.log(c.hint('Type exit at any prompt to end the session.\n'));

    while (true) {
      const read = await readInventoryAndHours(rl);
      if (read.status === 'exit') break;
      if (read.status === 'retry') continue;

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
    }
  } finally {
    rl.close();
  }
}
