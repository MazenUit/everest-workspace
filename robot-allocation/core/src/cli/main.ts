import { runCli } from './cli';
import { parseCliLevel } from './parse-level';

const level = parseCliLevel(process.argv[2]);

if (level === null) {
  console.error('Usage: npm run cli:level1  |  npm run cli:level2');
  process.exit(1);
}

runCli(level).catch((err) => {
  console.error(err);
  process.exit(1);
});
