import Stripe from 'stripe';
import { stripe } from '@/lib/stripe';
import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function POST(req: Request) {
  const body = await req.text();
  const headersList = await headers(); // ✅ await here
  const signature = headersList.get('Stripe-Signature') as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (error) {
    return new NextResponse(`Webhook Error: ${error}`, { status: 400 });
  }

  const session = event.data.object as Stripe.Checkout.Session;

  if (event.type === 'payment_intent.succeeded') {
    const paymentIntent = event.data.object as Stripe.PaymentIntent;

    const paidAmount = paymentIntent.amount;
    const walletAddress = paymentIntent.metadata?.walletAddress;

    const depositAmount = paidAmount / 1.02 / 100;

    const checkSql = 'SELECT * FROM useraccount WHERE walletAddress = ?';
    const [existingUser] = await query({
      query: checkSql,
      values: [walletAddress],
    });

    if (existingUser) {
      const newBalance =
        Number(existingUser.balance) + Number(depositAmount.toFixed(2));
      await query({
        query: `UPDATE useraccount SET balance = ? WHERE walletAddress = ?`,
        values: [newBalance, walletAddress],
      });
    }
  }

  return new NextResponse('OK', { status: 200 });
}
