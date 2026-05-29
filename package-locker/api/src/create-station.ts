import { Locker } from './domain/locker';
import { Size } from './domain/types';
import { LockerStation } from './services/locker-station';

// Create a default station with 4 lockers: 2 small, 1 medium, 1 large when the app starts.
export function createDefaultStation(): LockerStation {
  const lockers: Locker[] = [
    { id: 'S1', size: Size.Small, isAvailable: true },
    { id: 'S2', size: Size.Small, isAvailable: true },
    { id: 'M1', size: Size.Medium, isAvailable: true },
    { id: 'L1', size: Size.Large, isAvailable: true },
  ];
  return new LockerStation(lockers);
}