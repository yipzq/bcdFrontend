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

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Deposit() {
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');

  const depositAmount = parseFloat(amount) || 0;
  const processingFee = (depositAmount * 0.02).toFixed(2);
  const totalAmount = (depositAmount + parseFloat(processingFee)).toFixed(2);

  const router = useRouter();

  const handleSubmit = () => {
    if (depositAmount <= 0) {
      setError('Please enter a valid amount.');
      return;
    }

    // ✅ Store data in localStorage instead of API call
    localStorage.setItem('totalAmount', totalAmount);

    // ✅ Navigate to confirmation page
    router.push('/payment');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-md w-96">
        <h1 className="text-2xl font-bold text-center mb-4">Deposit</h1>
        <input
          className="w-full p-2 border border-gray-300 rounded mb-4"
          type="number"
          placeholder="Enter amount (USD)"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <div className="bg-gray-100 p-4 rounded">
          <p className="flex justify-between">
            <span>Deposit amount:</span>{' '}
            <span>{depositAmount.toFixed(2)} USD</span>
          </p>
          <p className="flex justify-between">
            <span>Processing fee (2%):</span>{' '}
            <span>{!isNaN(depositAmount) ? processingFee : '0.00'} USD</span>
          </p>
          <p className="flex justify-between font-bold">
            <span>Total amount:</span>{' '}
            <span>{!isNaN(depositAmount) ? totalAmount : '0.00'} USD</span>
          </p>
        </div>
        <button
          className="w-full bg-blue-500 text-white mt-4 p-2 rounded font-bold"
          onClick={handleSubmit}
        >
          {/* When click pay need stripe api to continue the transactions  */}
          Pay
        </button>
        {error && <p className="text-red-500 mb-4">{error}</p>}
      </div>
    </div>
  );
}
