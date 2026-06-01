// compare-only session — stdout is cost comparison + insight (see challenge image)

import * as readline from 'node:readline/promises';
import { stdin, stdout } from 'node:process';
import { runCompare } from '../services/compare';
import { printCompareResult } from './compare-output';
import { readInventoryAndHours } from './prompts.js';
import { c } from './colors';

export async function runCompareCli(): Promise<void> {
  const rl = readline.createInterface({ input: stdin, output: stdout });

  try {
    console.log(c.prompt('\nLevel 1 vs Level 2 Comparison\n'));
    console.log(c.hint('Type exit at any prompt to end the session.\n'));

    while (true) {
      const read = await readInventoryAndHours(rl);
      if (read.status === 'exit') break;
      if (read.status === 'retry') continue;

      const { inventory, hours } = read.data;
      console.log('');
      printCompareResult(runCompare(inventory, hours));
      console.log('');
    }
  } finally {
    rl.close();
  }
}
