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

export default function Deposit() {
  const [amount, setAmount] = useState('');

  const depositAmount = parseFloat(amount) || 0;
  const processingFee = (depositAmount * 0.02).toFixed(2);
  const totalAmount = (depositAmount + parseFloat(processingFee)).toFixed(2);

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
        <button className="w-full bg-blue-500 text-white mt-4 p-2 rounded font-bold">
          {/* When click pay need stripe api to continue the transactions  */}
          Pay 
        </button>
      </div>
    </div>
  );
}
