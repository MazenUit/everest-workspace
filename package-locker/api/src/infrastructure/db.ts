// pool to connect API to PostgreSQL and runs queries.
import { Pool } from 'pg';
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