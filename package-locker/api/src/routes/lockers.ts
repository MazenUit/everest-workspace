import { Router, Request, Response } from 'express';
import { LockerStation } from '../services/locker-station';
import { parsePackageSize } from './helpers/package-size';
import { parsePickupCode } from './helpers/pickup-code-body';
import { getDevRetrieveTime } from './helpers/dev-retrieve-time';
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

  router.get('/lockers', async (_req: Request, res: Response) => {
    try {
      const lockers = await station.listLockers();
      res.json({ lockers });
    } catch {
      res.status(500).json({ message: 'Failed to load lockers' });
    }
  });

  router.post('/packages/store', async (req: Request, res: Response) => {
    const packageSize = parsePackageSize(req.body?.packageSize);
    if (packageSize === null) {
      sendBadSize(res);
      return;
    }

    try {
      const result = await station.storePackage(packageSize);
      if (!result.ok) {
        sendNoLocker(res, result.reason);
        return;
      }
      sendStored(res, result.lockerId, result.pickupCode);
    } catch {
      res.status(500).json({ message: 'Failed to store package' });
    }
  });

  router.post('/lockers/:lockerId/retrieve', async (req: Request, res: Response) => {
    const pickupCode = parsePickupCode(req.body?.pickupCode);
    if (pickupCode === null) {
      sendMissingPickupCode(res);
      return;
    }

    const devRetrieveTime = getDevRetrieveTime(req);

    try {
      const result = await station.retrievePackage(
        req.params.lockerId,
        pickupCode,
        devRetrieveTime
      );

      if (!result.ok) {
        if (result.reason === 'INVALID_PICKUP') {
          sendInvalidPickup(res);
          return;
        }
        sendRetrieveNotFound(res, result.reason);
        return;
      }

      sendRetrieved(res, result.lockerId, result.storageCharge);
    } catch {
      res.status(500).json({ message: 'Failed to retrieve package' });
    }
  });

  return router;
}
