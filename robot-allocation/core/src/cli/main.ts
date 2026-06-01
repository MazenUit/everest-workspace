import { runCli } from './cli';

// Start the terminal app when you run npm run cli.
runCli().catch((err) => {
  console.error(err);
  process.exit(1);
});
