// import React from 'react';

// export default function Deposit() {
//   return (
//     <div className="flex flex-col items-center justify-center min-h-screen">
//       <h1 className="text-2xl font-bold">Deposit</h1>
//       <input
//         className="w-64 p-2 mt-4 text-black rounded"
//         type="number"
//         placeholder="Enter amount"
//       />
//       <button className="w-64 bg-blue-500 mt-4 p-2 rounded">Pay</button>
//     </div>
//   );
// }

'use client';

import React, { useState, useEffect } from 'react';
import CheckoutPage from '@/app/components/CheckoutPage';
import convertToSubcurrency from '@/lib/convertToSubcurrency';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

if (process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY === undefined) {
  throw new Error('NEXT_PUBLIC_STRIPE_PUBLIC_KEY is not defined');
}

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY);

export default function Payment() {
  const [totalAmount, setTotalAmount] = useState(0.0);

  useEffect(() => {
    // ✅ Retrieve deposit data from localStorage
    const storedData = localStorage.getItem('totalAmount');
    if (storedData) {
      setTotalAmount(parseFloat(storedData));
    }
  }, []);

  if (!totalAmount) {
    return <p>Loading...</p>; // Show a loading message while fetching data
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-gradient-to-tr from-blue-500 to-purple-500 p-6 rounded-lg shadow-md w-96">
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
