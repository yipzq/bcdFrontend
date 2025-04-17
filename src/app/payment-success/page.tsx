'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

export default function PaymentSuccess() {
  // Use the `useSearchParams` hook to access search parameters
  const searchParams = useSearchParams();

  // Access the `amount` query parameter from searchParams
  const amount = searchParams?.get('amount');

  return (
    <main className="max-w-6xl mx-auto p-10 text-white text-center border m-10 rounded-md bg-gradient-to-tr from-blue-500 to-purple-500">
      <div className="mb-10">
        <h1 className="text-4xl font-extrabold mb-2">Thank you!</h1>
        <h2 className="text-2xl">You successfully sent</h2>

        <div className="bg-white p-2 rounded-md text-purple-500 mt-5 text-4xl font-bold">
          ${amount}
        </div>

        <Link href="/">
          <button className="mt-15 bg-white text-purple-600 px-8 py-3 rounded-md hover:bg-purple-100 transition font-semibold">
            Go to Home
          </button>
        </Link>
      </div>
    </main>
  );
}
