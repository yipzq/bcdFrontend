import { query } from '@/lib/db';
import { NextRequest } from 'next/server';

interface UserAccount {
  walletAddress: string;
  balance: number;
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const walletAddress = searchParams.get('walletAddress');

    const querySql = 'SELECT * FROM useraccount WHERE walletAddress = ?';
    const data = (await query({
      query: querySql,
      values: [walletAddress],
    })) as UserAccount[];

    if (data.length === 0) {
      const insertSql = 'INSERT INTO useraccount (walletAddress) VALUES (?)';
      await query({
        query: insertSql,
        values: [walletAddress],
      });

      const newUser: UserAccount = {
        walletAddress: walletAddress ?? '',
        balance: 0.0, // assuming new users start with 0 balance
      };

      return new Response(JSON.stringify({ useraccounts: newUser }), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }

    return new Response(JSON.stringify({ useraccounts: data }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error: any) {
    console.error('Database Query Error:', error);

    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}
