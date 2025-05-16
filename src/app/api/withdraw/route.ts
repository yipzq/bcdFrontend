// app/api/withdraw/route.ts
import { NextRequest, NextResponse } from 'next/server';
import mysql from 'mysql2/promise';
import { query } from '@/lib/db';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { email, amount, totalAmount, address } = body;

  if (!email || !amount) {
    return NextResponse.json(
      { error: 'Missing email or amount' },
      { status: 400 }
    );
  }

  if (amount < 5000) {
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
            value: amount.toFixed(2),
            currency: 'USD',
          },
          receiver: email,
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

    // Check user balance
    const data = await query({
      query: `SELECT balance FROM useraccount WHERE walletAddress = ?`,
      values: [address],
    });

    if (data.length === 0) {
      return NextResponse.json({ error: 'Wallet not found' }, { status: 404 });
    }

    const currentBalance = Number(data[0].balance);
    const newBalance = currentBalance - Number(totalAmount);

    if (newBalance < 0) {
      return NextResponse.json(
        { error: 'Insufficient USD balance' },
        { status: 400 }
      );
    }

    // Update USD balance
    await query({
      query: `UPDATE useraccount SET balance = ? WHERE walletAddress = ?`,
      values: [newBalance, address],
    });

    // Insert transaction record
    await query({
      query:
        'INSERT INTO transaction (initiator, type, amountUSD, status, transactionDateTime) VALUES (?, ?, ?, ?, NOW())',
      values: [address, 5, totalAmount, 'Completed'],
    });

    const sql = 'SELECT total FROM fee';
    const [currentFeeBalance] = await query({
      query: sql,
    });

    if (!currentFeeBalance) {
      await query({
        query: `INSERT INTO fee (total) VALUES (?)`,
        values: [totalAmount - amount],
      });
    } else {
      const newFeeBalance =
        Number(currentFeeBalance.total) + Number(totalAmount - amount);
      await query({
        query: `UPDATE fee SET total = ?`,
        values: [newFeeBalance],
      });
    }

    return NextResponse.json({ success: true, payout: payoutData });
  } else {
    // Check user balance
    const data = await query({
      query: `SELECT balance FROM useraccount WHERE walletAddress = ?`,
      values: [address],
    });

    if (data.length === 0) {
      return NextResponse.json({ error: 'Wallet not found' }, { status: 404 });
    }

    const currentBalance = Number(data[0].balance);
    const newBalance = currentBalance - Number(totalAmount);

    if (newBalance < 0) {
      return NextResponse.json(
        { error: 'Insufficient USD balance' },
        { status: 400 }
      );
    }

    // Insert transaction record
    await query({
      query:
        'INSERT INTO transaction (initiator, type, amountUSD, status, transactionDateTime) VALUES (?, ?, ?, ?, NOW())',
      values: [address, 5, totalAmount, 'Pending'],
    });

    return new Response(JSON.stringify({}), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}
