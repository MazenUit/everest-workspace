import 'dotenv/config';
import express from 'express';
import { config } from './config';
import { createStation } from './create-station';
import { registerRoutes } from './routes';
import { checkDatabaseConnection } from './infrastructure/db';

const app = express();
const station = createStation();

app.use(express.json());
registerRoutes(app, station);

async function start() {
  await checkDatabaseConnection();
  console.log('Connected to Postgres');

  app.listen(config.port, () => {
    console.log(`API listening on port ${config.port}`);
  });
}

start().catch((err) => {
  console.error('Failed to start:', err);
  process.exit(1);
});
