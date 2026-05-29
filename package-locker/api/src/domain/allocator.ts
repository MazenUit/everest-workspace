import { Locker } from './locker';
import { Size, lockerFitsPackage, sizeIndex } from './types';

export function findSmallestAvailableLocker(
    lockers: Locker[],
    packageSize: Size
  ): Locker | null {
    let best: Locker | null = null;
  
    for (const locker of lockers) {
      // One package per locker
      if (!locker.isAvailable) continue;
      // Package must fit
      if (!lockerFitsPackage(locker.size, packageSize)) continue;
      // Prefer smallest locker that fits
      if (best === null || sizeIndex(locker.size) < sizeIndex(best.size)) {
        best = locker;
      }
    }
  
    return best;
  }