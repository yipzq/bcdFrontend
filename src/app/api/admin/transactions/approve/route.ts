// src/app/api/admin/transactions/approve/route.ts
// import { query } from '@/lib/db';
// import { NextResponse } from 'next/server';
// import { sendWithdrawalApprovedEmail } from '@/lib/resend';

// export async function POST(req: Request) {
//   try {
//     const { transactionId } = await req.json();

//     // 1. Fetch the transaction
//     const [transaction] = (await query({
//       query: 'SELECT * FROM transaction WHERE transactionID = ?',
//       values: [transactionId],
//     })) as any[];

//     if (!transaction) {
//       return NextResponse.json(
//         { error: 'Transaction not found' },
//         { status: 404 }
//       );
//     }

//     const { type, status, amountUSD, initiator, reference } = transaction;
//     const paymentReference = JSON.parse(reference);

//     if (status !== 'Pending') {
//       return NextResponse.json(
//         { error: 'Transaction already processed' },
//         { status: 400 }
//       );
//     }

//     // 2. Handle Withdrawal (type = 5)
//     if (type === 5 && amountUSD >= 10000) {
//       const [user] = (await query({
//         query: 'SELECT balance FROM useraccount WHERE walletAddress = ?',
//         values: [initiator],
//       })) as any[];

//       if (!user) {
//         return NextResponse.json({ error: 'User not found' }, { status: 404 });
//       }
//       //Need to add validations in withdrawal page, if user balance is less than amountUSD will not enter admin dashboard for approval.
//       if (Number(user.balance) < Number(amountUSD)) {
//         return NextResponse.json(
//           { error: 'Insufficient balance' },
//           { status: 400 }
//         );
//       }

//       if (!paymentReference.email || !paymentReference.amount) {
//         return NextResponse.json(
//           { error: 'Missing email or amount' },
//           { status: 400 }
//         );
//       }

//       const clientId = process.env.PAYPAL_CLIENT_ID!;
//       const clientSecret = process.env.PAYPAL_CLIENT_SECRET!;

//       const basicAuth = Buffer.from(`${clientId}:${clientSecret}`).toString(
//         'base64'
//       );

//       // Step 1: Get PayPal access token
//       const tokenRes = await fetch(
//         'https://api-m.sandbox.paypal.com/v1/oauth2/token',
//         {
//           method: 'POST',
//           headers: {
//             Authorization: `Basic ${basicAuth}`,
//             'Content-Type': 'application/x-www-form-urlencoded',
//           },
//           body: 'grant_type=client_credentials',
//         }
//       );

//       const tokenData = await tokenRes.json();

//       if (!tokenRes.ok) {
//         return NextResponse.json(
//           { error: 'Failed to get PayPal token', details: tokenData },
//           { status: 500 }
//         );
//       }

//       const accessToken = tokenData.access_token;

//       // Step 2: Create Payout
//       const payoutBody = {
//         sender_batch_header: {
//           sender_batch_id: Date.now().toString(),
//           email_subject: "You've received a payout!",
//         },
//         items: [
//           {
//             recipient_type: 'EMAIL',
//             amount: {
//               value: paymentReference.amount.toFixed(2),
//               currency: 'USD',
//             },
//             receiver: paymentReference.email,
//             note: 'Thanks for using our platform!',
//             sender_item_id: 'withdrawal_' + Date.now(),
//           },
//         ],
//       };

//       const payoutRes = await fetch(
//         'https://api-m.sandbox.paypal.com/v1/payments/payouts',
//         {
//           method: 'POST',
//           headers: {
//             'Content-Type': 'application/json',
//             Authorization: `Bearer ${accessToken}`,
//           },
//           body: JSON.stringify(payoutBody),
//         }
//       );

//       const payoutData = await payoutRes.json();

//       if (!payoutRes.ok) {
//         return NextResponse.json(
//           { error: 'Failed to send payout', details: payoutData },
//           { status: 500 }
//         );
//       }

//       const sql = 'SELECT total FROM fee';
//       const [currentFeeBalance] = await query({
//         query: sql,
//       });

//       if (!currentFeeBalance) {
//         await query({
//           query: `INSERT INTO fee (total) VALUES (?)`,
//           values: [amountUSD - paymentReference.amount],
//         });
//       } else {
//         const newFeeBalance =
//           Number(currentFeeBalance.total) +
//           Number(amountUSD - paymentReference.amount);
//         await query({
//           query: `UPDATE fee SET total = ?`,
//           values: [newFeeBalance],
//         });
//       }
      

//       // Deduct balance
//       await query({
//         query:
//           'UPDATE useraccount SET balance = balance - ? WHERE walletAddress = ?',
//         values: [amountUSD, initiator],
//       });
//     }

//     await query({
//       query: 'UPDATE transaction SET status = ? WHERE transactionID = ?',
//       values: ['Approved', transactionId],
//     });

//     return NextResponse.json({ message: 'Transaction approved' });
//   } catch (error) {
//     console.error('Approval error:', error);
//     return NextResponse.json(
//       { error: 'Failed to approve transaction' },
//       { status: 500 }
//     );
//   }
// }

// src/app/api/admin/transactions/approve/route.ts
import { query } from '@/lib/db';
import { NextResponse } from 'next/server';
import { sendWithdrawalApprovedEmail } from '@/lib/resend';

export async function POST(req: Request) {
  try {
    const { transactionId } = await req.json();

    // 1. Fetch the transaction
    const [transaction] = (await query({
      query: 'SELECT * FROM transaction WHERE transactionID = ?',
      values: [transactionId],
    })) as any[];

    if (!transaction) {
      return NextResponse.json(
        { error: 'Transaction not found' },
        { status: 404 }
      );
    }

    const { type, status, amountUSD, initiator, reference } = transaction;
    const paymentReference = JSON.parse(reference);

    if (status !== 'Pending') {
      return NextResponse.json(
        { error: 'Transaction already processed' },
        { status: 400 }
      );
    }

    // 2. Handle Withdrawal (type = 5)
    if (type === 5 && amountUSD >= 10000) {
      const [user] = (await query({
        query: 'SELECT balance FROM useraccount WHERE walletAddress = ?',
        values: [initiator],
      })) as any[];

      if (!user) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
      }

      if (Number(user.balance) < Number(amountUSD)) {
        return NextResponse.json(
          { error: 'Insufficient balance' },
          { status: 400 }
        );
      }

      if (!paymentReference.email || !paymentReference.amount) {
        return NextResponse.json(
          { error: 'Missing email or amount' },
          { status: 400 }
        );
      }

      const clientId = process.env.PAYPAL_CLIENT_ID!;
      const clientSecret = process.env.PAYPAL_CLIENT_SECRET!;

      const basicAuth = Buffer.from(`${clientId}:${clientSecret}`).toString(
        'base64'
      );

      // Step 1: Get PayPal access token
      const tokenRes = await fetch(
        'https://api-m.sandbox.paypal.com/v1/oauth2/token',
        {
          method: 'POST',
          headers: {
            Authorization: `Basic ${basicAuth}`,
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: 'grant_type=client_credentials',
        }
      );

      const tokenData = await tokenRes.json();

      if (!tokenRes.ok) {
        return NextResponse.json(
          { error: 'Failed to get PayPal token', details: tokenData },
          { status: 500 }
        );
      }

      const accessToken = tokenData.access_token;

      // Step 2: Create Payout
      const payoutBody = {
        sender_batch_header: {
          sender_batch_id: Date.now().toString(),
          email_subject: "You've received a payout!",
        },
        items: [
          {
            recipient_type: 'EMAIL',
            amount: {
              value: paymentReference.amount.toFixed(2),
              currency: 'USD',
            },
            receiver: paymentReference.email,
            note: 'Thanks for using our platform!',
            sender_item_id: 'withdrawal_' + Date.now(),
          },
        ],
      };

      const payoutRes = await fetch(
        'https://api-m.sandbox.paypal.com/v1/payments/payouts',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify(payoutBody),
        }
      );

      const payoutData = await payoutRes.json();

      if (!payoutRes.ok) {
        return NextResponse.json(
          { error: 'Failed to send payout', details: payoutData },
          { status: 500 }
        );
      }

      const sql = 'SELECT total FROM fee';
      const [currentFeeBalance] = await query({
        query: sql,
      });

      if (!currentFeeBalance) {
        await query({
          query: `INSERT INTO fee (total) VALUES (?)`,
          values: [amountUSD - paymentReference.amount],
        });
      } else {
        const newFeeBalance =
          Number(currentFeeBalance.total) +
          Number(amountUSD - paymentReference.amount);
        await query({
          query: `UPDATE fee SET total = ?`,
          values: [newFeeBalance],
        });
      }

      // Deduct balance
      await query({
        query:
          'UPDATE useraccount SET balance = balance - ? WHERE walletAddress = ?',
        values: [amountUSD, initiator],
      });
    }
    await query({
      query: 'UPDATE transaction SET status = ? WHERE transactionID = ?',
      values: ['Approved', transactionId],
    });

    if (paymentReference?.email) {
      await sendWithdrawalApprovedEmail(paymentReference.email, amountUSD);
    }

    return NextResponse.json({ message: 'Transaction approved' });
  } catch (error) {
    console.error('Approval error:', error);
    return NextResponse.json(
      { error: 'Failed to approve transaction' },
      { status: 500 }
    );
  }
}
