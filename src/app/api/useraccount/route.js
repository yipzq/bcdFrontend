import { query } from '@/lib/db'; // Ensure the correct path

export async function GET() {
  try {
    const querySql = 'SELECT * FROM useraccount';
    const data = await query({ query: querySql, values: [] });

    return new Response(JSON.stringify({ useraccounts: data }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Database Query Error:', error);

    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
