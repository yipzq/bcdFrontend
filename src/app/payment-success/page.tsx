'use client';

import { useEffect } from 'react';

export default function PaymentSuccess({
  searchParams: { amount },
}: {
  searchParams: { amount: string };
}) {
  const parsedAmount = parseFloat(amount);

  // Validation checks
  const isInvalidAmount = isNaN(parsedAmount) || parsedAmount <= 0;

  if (isInvalidAmount) {
    return (
      <main className="max-w-6xl mx-auto p-10 text-white text-center border m-10 rounded-md bg-red-500">
        <div className="mb-10">
          <h1 className="text-4xl font-extrabold mb-2">Error</h1>
          <h2 className="text-2xl">Invalid payment amount</h2>
          <p className="mt-5 text-lg">
            Please try again or contact support if you believe this is a
            mistake.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="max-w-6xl mx-auto p-10 text-white text-center border m-10 rounded-md bg-gradient-to-tr from-blue-500 to-purple-500">
      <div className="mb-10">
        <h1 className="text-4xl font-extrabold mb-2">Thank you!</h1>
        <h2 className="text-2xl">You successfully sent</h2>

        <div className="bg-white p-2 rounded-md text-purple-500 mt-5 text-4xl font-bold">
          ${parsedAmount.toFixed(2)}
        </div>
      </div>
    </main>
  );
}
