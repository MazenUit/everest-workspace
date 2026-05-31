// pool to connect API to PostgreSQL and runs queries.
// PoolClient
import { Pool, PoolClient } from 'pg';
import { config } from '../config';

let pool: Pool | null = null;

export function getPool(): Pool {
  if (!pool) {
    if (!config.databaseUrl) {
      throw new Error('DATABASE_URL is not set');
    }
    // Every request → open new connection → query → close
    pool = new Pool({ connectionString: config.databaseUrl });
  }
  return pool;
}

// check if the database is reachable
export async function checkDatabaseConnection(): Promise<void> {
  const client = await getPool().connect();
  try {
    await client.query('SELECT 1');
  } finally {
    client.release();
  }
}

// store and retrieve touch lockers + package_assignments; both must commit or neither does.
export async function withTransaction<T>(
  fn: (client: PoolClient) => Promise<T>
): Promise<T> {
  // get one connection from the pool
  const client = await getPool().connect();
  try {
    // start transaction
    await client.query('BEGIN');
    // store/retrieve logic runs
    const result = await fn(client);
    // persist all changes
    await client.query('COMMIT');
    return result;
  } catch (err) {
    // undo partial work
    await client.query('ROLLBACK');
    throw err;
  } finally {
    // return connection to pool
    client.release();
  }
}
