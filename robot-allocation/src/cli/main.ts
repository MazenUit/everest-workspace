import { runCli, runCompareCli, runLevel3Cli } from './cli';
import { parseCliLevel } from './parse-level';

const level = parseCliLevel(process.argv[2]);

if (level === null) {
  console.error(
    'Usage: npm run cli:level1  |  npm run cli:level2  |  npm run cli:level3  |  npm run cli:compare'
  );
  process.exit(1);
}

const run =
  level === 'compare' ? runCompareCli() :
  level === 3 ? runLevel3Cli() :
  runCli(level);

run.catch((err) => {
  console.error(err);
  process.exit(1);
});
