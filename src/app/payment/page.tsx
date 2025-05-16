'use client';

import React, { useState, useEffect } from 'react';
import CheckoutPage from '@/app/components/CheckoutPage';
import convertToSubcurrency from '@/lib/convertToSubcurrency';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

if (!process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY) {
  throw new Error('NEXT_PUBLIC_STRIPE_PUBLIC_KEY is not defined');
}

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY);

export default function Payment() {
  const [totalAmount, setTotalAmount] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const storedData = localStorage.getItem('totalAmount');

      if (!storedData) {
        setError('No payment data found. Please start a new deposit.');
        return;
      }

      const parsedAmount = parseFloat(storedData);

      if (isNaN(parsedAmount) || parsedAmount <= 0) {
        setError('Invalid deposit amount. Please enter a valid amount.');
        return;
      }

      setTotalAmount(parsedAmount);
    } catch (err) {
      setError('An error occurred while retrieving payment data.');
    }
  }, []);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <div className="bg-red-500 text-white p-4 rounded-lg shadow-md">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (totalAmount === null) {
    return (
      <p className="text-center text-gray-600">Loading payment details...</p>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white p-6 relative">
      <div className="bg-gradient-to-tr from-blue-500 to-purple-500 p-6 rounded-lg shadow-md w-96 ">
        <Elements
          stripe={stripePromise}
          options={{
            mode: 'payment',
            amount: convertToSubcurrency(totalAmount),
            currency: 'usd',
          }}
        >
          <CheckoutPage amount={totalAmount} />
        </Elements>
      </div>
    </div>
  );
}
