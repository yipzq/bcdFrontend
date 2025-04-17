import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: process.env.DATABASE_HOST || 'localhost',
  user: process.env.DATABASE_USER || 'root',
  password: process.env.DATABASE_PASSWORD || '', // Default to empty string if missing
  database: process.env.DATABASE_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

interface QueryOptions {
  query: string;
  values?: any[]; // or you can type more strictly depending on usage
}

export async function query({
  query,
  values = [],
}: QueryOptions): Promise<any> {
  const [results] = await pool.execute(query, values);
  return results;
}
