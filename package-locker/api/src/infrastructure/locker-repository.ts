import { Locker } from '../domain/locker';
import { sizeFromLabel } from '../domain/types';
import { getPool } from './db';
import { PoolClient } from 'pg';

export interface LockerRepository {
  listLockers(): Promise<Locker[]>;
  listLockersForUpdate(client: PoolClient): Promise<Locker[]>;
  markUnavailable(client: PoolClient, lockerId: string): Promise<boolean>;
  markAvailable(client: PoolClient, lockerId: string): Promise<void>;
  lockerExists(lockerId: string): Promise<boolean>;
}

type LockerRow = { id: string; size: string; is_available: boolean };
// domain Locker uses camelCase and Size enum.
function rowToLocker(row: LockerRow): Locker {
  return {
    id: row.id,
    size: sizeFromLabel(row.size),
    isAvailable: row.is_available,
  };
}

export class PostgresLockerRepository implements LockerRepository {
    async listLockers(): Promise<Locker[]> {
      const result = await getPool().query<LockerRow>(
        `SELECT id, size, is_available
         FROM lockers
         ORDER BY id`
      );
      return result.rows.map(rowToLocker);
    }
    // only inside withTransaction — locks rows until COMMIT (concurrent store safety).
    async listLockersForUpdate(client: PoolClient): Promise<Locker[]> {
      const result = await client.query<LockerRow>(
        `SELECT id, size, is_available
         FROM lockers
         ORDER BY id
         FOR UPDATE`
      );
      return result.rows.map(rowToLocker);
    }
    // fails if another transaction already took this locker.
    async markUnavailable(client: PoolClient, lockerId: string): Promise<boolean> {
      const result = await client.query(
        `UPDATE lockers
         SET is_available = false
         WHERE id = $1 AND is_available = true
         RETURNING id`,
        [lockerId]
      );
      return result.rowCount !== null && result.rowCount > 0;
    }
    async markAvailable(client: PoolClient, lockerId: string): Promise<void> {
      await client.query(
        `UPDATE lockers SET is_available = true WHERE id = $1`,
        [lockerId]
      );
    }
    async lockerExists(lockerId: string): Promise<boolean> {
      const result = await getPool().query(
        `SELECT 1 FROM lockers WHERE id = $1 LIMIT 1`,
        [lockerId]
      );
      return result.rowCount !== null && result.rowCount > 0;
    }
  }