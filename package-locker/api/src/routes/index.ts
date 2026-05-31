import { Express } from 'express';
import { LockerStation } from '../services/locker-station';
import healthRouter from './health';
import { createLockersRouter } from './lockers';

export function registerRoutes(app: Express, station: LockerStation): void {
  app.use(healthRouter);
  app.use(createLockersRouter(station));
}
