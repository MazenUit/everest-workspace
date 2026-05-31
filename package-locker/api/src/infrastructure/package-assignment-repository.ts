import { PoolClient } from 'pg';
import { Size } from '../domain/types';
import { getPool } from './db';

/** package still in a locker (not picked up yet). */
export type ActiveAssignment = {
  pickupCode: string;
  storedAt: Date;
};

export interface PackageAssignmentRepository {
  insert(
    client: PoolClient,
    lockerId: string,
    pickupCode: string,
    packageSize: Size,
    storedAt: Date
  ): Promise<void>;

  findActiveForLocker(
    client: PoolClient,
    lockerId: string
  ): Promise<ActiveAssignment | null>;

  markRetrieved(
    client: PoolClient,
    lockerId: string,
    retrievedAt: Date
  ): Promise<void>;

  isPickupCodeInUse(pickupCode: string): Promise<boolean>;
}

type AssignmentRow = {
  pickup_code: string;
  stored_at: Date;
};

function toAssignment(row: AssignmentRow): ActiveAssignment {
  return {
    pickupCode: row.pickup_code,
    storedAt: new Date(row.stored_at),
  };
}

export class PostgresPackageAssignmentRepository
  implements PackageAssignmentRepository
{
// package stored: one row with locker id, code, size, time. same client as locker UPDATE
  async insert(
    client: PoolClient,
    lockerId: string,
    pickupCode: string,
    packageSize: Size,
    storedAt: Date
  ): Promise<void> {
    await client.query(
      `INSERT INTO package_assignments (locker_id, pickup_code, package_size, stored_at)
       VALUES ($1, $2, $3::locker_size, $4)`,
      [lockerId, pickupCode, packageSize, storedAt]
    );
  }
// retrieve and concurrent store don’t race
  async findActiveForLocker(
    client: PoolClient,
    lockerId: string
  ): Promise<ActiveAssignment | null> {
    const result = await client.query<AssignmentRow>(
      `SELECT pickup_code, stored_at
       FROM package_assignments
       WHERE locker_id = $1 AND retrieved_at IS NULL
       LIMIT 1
       FOR UPDATE`,
      [lockerId]
    );

    if (result.rows.length === 0) return null;
    return toAssignment(result.rows[0]);
  }

// pickup done: set retrieved_at. WHERE retrieved_at IS NULL so we only close an open assignment.
  async markRetrieved(
    client: PoolClient,
    lockerId: string,
    retrievedAt: Date
  ): Promise<void> {
    await client.query(
      `UPDATE package_assignments
       SET retrieved_at = $2
       WHERE locker_id = $1 AND retrieved_at IS NULL`,
      [lockerId, retrievedAt]
    );
  }

 // generate unique code before insert; table has UNIQUE on pickup_code including history
  async isPickupCodeInUse(pickupCode: string): Promise<boolean> {
    const result = await getPool().query(
      `SELECT 1 FROM package_assignments WHERE pickup_code = $1 LIMIT 1`,
      [pickupCode]
    );
    return result.rowCount !== null && result.rowCount > 0;
  }
}