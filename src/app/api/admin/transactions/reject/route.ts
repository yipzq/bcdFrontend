// src/app/api/admin/transactions/reject/route.ts
// import { query } from '@/lib/db';
// import { NextResponse } from 'next/server';

// export async function POST(req: Request) {
//   try {
//     const { transactionId } = await req.json();

//     await query({
//       query: 'UPDATE transaction SET status = ? WHERE transactionID = ?',
//       values: ['Rejected', transactionId],
//     });

//     return NextResponse.json({ message: 'Transaction rejected' });
//   } catch (error) {
//     console.error('Rejection error:', error);
//     return NextResponse.json(
//       { error: 'Failed to reject transaction' },
//       { status: 500 }
//     );
//   }
// }


import { query } from '@/lib/db';
import { NextResponse } from 'next/server';
import { sendWithdrawalRejectedEmail } from '@/lib/resend'; // import the email function

export async function POST(req: Request) {
  try {
    const { transactionId } = await req.json();

    // Get transaction details
    const [transaction] = (await query({
      query: 'SELECT * FROM transaction WHERE transactionID = ?',
      values: [transactionId],
    })) as any[];

    if (!transaction) {
      return NextResponse.json({ error: 'Transaction not found' }, { status: 404 });
    }

    const { reference, amountUSD } = transaction;
    const refData = reference ? JSON.parse(reference) : null;

    await query({
      query: 'UPDATE transaction SET status = ? WHERE transactionID = ?',
      values: ['Rejected', transactionId],
    });

    // Send email if reference contains a valid email
    if (refData?.email) {
      await sendWithdrawalRejectedEmail(refData.email, amountUSD);
    }

    return NextResponse.json({ message: 'Transaction rejected and user notified' });
  } catch (error) {
    console.error('Rejection error:', error);
    return NextResponse.json({ error: 'Failed to reject transaction' }, { status: 500 });
  }
}
