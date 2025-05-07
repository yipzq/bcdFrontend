// src/app/api/admin/transactions/approve/route.ts
import { query } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { transactionId } = await req.json();

    // 1. Fetch the transaction
    const [transaction] = await query({
      query: 'SELECT * FROM transaction WHERE transactionID = ?',
      values: [transactionId],
    }) as any[];

    if (!transaction) {
      return NextResponse.json({ error: 'Transaction not found' }, { status: 404 });
    }

    const { type, status, amountUSD, initiator } = transaction;

    if (status !== 'Pending') {
      return NextResponse.json({ error: 'Transaction already processed' }, { status: 400 });
    }

    // 2. Handle Withdrawal (type = 5)
    if (type === 5 && amountUSD >= 50000) {
      const [user] = await query({
        query: 'SELECT balance FROM useraccount WHERE walletAddress = ?',
        values: [initiator],
      }) as any[];

      if (!user) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
      }
      //Need to add validations in withdrawal page, if user balance is less than amountUSD will not enter admin dashboard for approval.
      if (user.balance < amountUSD) {
        return NextResponse.json({ error: 'Insufficient balance' }, { status: 400 });
      }

      // Deduct balance
      await query({
        query: 'UPDATE useraccount SET balance = balance - ? WHERE walletAddress = ?',
        values: [amountUSD, initiator],
      });
    }

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