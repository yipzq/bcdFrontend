// src/app/api/admin/transactions/route.ts

import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET() {
  try {
    const results = await query({
      query: `
          SELECT 
            transactionID AS id,
            type AS type,
            amountUSD,
            amountToken,
            initiator AS sender,
            recipient,
            status,
            transactionDateTime AS date
          FROM transaction
          WHERE (type = '5')
            AND (amountUSD >= 10000 OR amountToken >= 10000)
          ORDER BY transactionDateTime DESC
        `,
    });

    return NextResponse.json(results);
  } catch (error) {
    console.error('Error fetching transaction:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
