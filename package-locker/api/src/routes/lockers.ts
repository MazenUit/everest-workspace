import { Router, Request, Response } from 'express';
import { LockerStation } from '../services/locker-station';
import { parsePackageSize } from './helpers/package-size';
import { parsePickupCode } from './helpers/pickup-code-body';
import {
  sendBadSize,
  sendNoLocker,
  sendStored,
  sendMissingPickupCode,
  sendRetrieveNotFound,
  sendInvalidPickup,
  sendRetrieved,
} from './helpers/responses';

export function createLockersRouter(station: LockerStation): Router {
  const router = Router();

  router.get('/lockers', (_req: Request, res: Response) => {
    res.json({ lockers: station.listLockers() });
  });

  router.post('/packages/store', (req: Request, res: Response) => {
    const packageSize = parsePackageSize(req.body?.packageSize);

    if (packageSize === null) {
      sendBadSize(res);
      return;
    }

    const result = station.storePackage(packageSize);

    if (!result.ok) {
      sendNoLocker(res, result.reason);
      return;
    }

    sendStored(res, result.lockerId, result.pickupCode);
  });

  router.post('/lockers/:lockerId/retrieve', (req: Request, res: Response) => {
    const pickupCode = parsePickupCode(req.body?.pickupCode);
    if (pickupCode === null) {
      sendMissingPickupCode(res);
      return;
    }
    const result = station.retrievePackage(req.params.lockerId, pickupCode);
    if (!result.ok) {
      if (result.reason === 'INVALID_PICKUP') {
        sendInvalidPickup(res);
        return;
      }
      sendRetrieveNotFound(res, result.reason);
      return;
    }
    sendRetrieved(res, result.lockerId);
  });

  return router;
}