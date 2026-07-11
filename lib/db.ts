import { Pool, PoolClient, QueryResult, QueryResultRow } from 'pg';

const connectionString = process.env.DATABASE_URL;

// Prevent multiple pools from being created in development (due to hot reloading)
const globalForDb = globalThis as unknown as {
  connPool: Pool | undefined;
};

let dbPool: Pool;

if (process.env.NODE_ENV === 'production') {
  dbPool = new Pool({
    connectionString,
    ssl: {
      rejectUnauthorized: false, // Required for Neon connection
    },
    max: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
  });
} else {
  if (!globalForDb.connPool) {
    globalForDb.connPool = new Pool({
      connectionString,
      ssl: {
        rejectUnauthorized: false, // Required for Neon connection
      },
      max: 10,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000,
    });
  }
  dbPool = globalForDb.connPool;
}

export const pool = dbPool;

/**
 * Execute a query on the PostgreSQL database.
 */
export async function query<T extends QueryResultRow = any>(
  text: string,
  params?: any[]
): Promise<QueryResult<T>> {
  if (!connectionString) {
    throw new Error('DATABASE_URL is not defined in the environment variables');
  }
  const start = Date.now();
  const res = await pool.query<T>(text, params);
  const duration = Date.now() - start;
  if (process.env.NODE_ENV !== 'production') {
    console.log('Executed query', { text, duration, rows: res.rowCount });
  }
  return res;
}

/**
 * Get a single client from the pool for transactions.
 * Remember to call client.release() when done.
 */
export async function getClient(): Promise<PoolClient> {
  if (!connectionString) {
    throw new Error('DATABASE_URL is not defined in the environment variables');
  }
  const client = await pool.connect();
  return client;
}
