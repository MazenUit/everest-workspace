import { PostgresLockerRepository } from './infrastructure/locker-repository';
import { PostgresPackageAssignmentRepository } from './infrastructure/package-assignment-repository';
import { LockerStation } from './services/locker-station';


// create a station when the app starts.
export function createStation(): LockerStation {
  return new LockerStation(
    new PostgresLockerRepository(),
    new PostgresPackageAssignmentRepository()
  );
}
