// src/app/api/admin/transactions/reject/route.ts
import { query } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { transactionId } = await req.json();

    await query({
      query: 'UPDATE transaction SET status = ? WHERE transactionID = ?',
      values: ['Rejected', transactionId],
    });

    return NextResponse.json({ message: 'Transaction rejected' });
  } catch (error) {
    console.error('Rejection error:', error);
    return NextResponse.json(
      { error: 'Failed to reject transaction' },
      { status: 500 }
    );
  }
}
