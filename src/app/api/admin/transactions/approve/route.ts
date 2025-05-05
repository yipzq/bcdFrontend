// src/app/api/admin/transactions/approve/route.ts
import { query } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { transactionId } = await req.json();

    await query({
      query: 'UPDATE transaction SET status = ? WHERE transactionID = ?',
      values: ['Approved', transactionId],
    });

    return NextResponse.json({ message: 'Transaction approved' });
  } catch (error) {
    console.error('Approval error:', error);
    return NextResponse.json(
      { error: 'Failed to approve transaction' },
      { status: 500 }
    );
  }
}
