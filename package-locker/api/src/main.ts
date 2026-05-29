import 'dotenv/config';
import express from 'express';
import { config } from './config';
import { createDefaultStation } from './create-station';
import { registerRoutes } from './routes';

const app = express();
const station = createDefaultStation();

app.use(express.json());
registerRoutes(app, station);

app.listen(config.port, () => {
  console.log(`API listening on port ${config.port}`);
});