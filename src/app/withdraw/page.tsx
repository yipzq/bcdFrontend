// File: components/WithdrawButton.tsx

'use client';

import { useState } from 'react';
import { useAccount } from 'wagmi';

export default function WithdrawButton() {
  const [email, setEmail] = useState('');
  const [amount, setAmount] = useState(0);
  const [message, setMessage] = useState('');
  const [error, setError] = useState<string>('');
  const { isConnected, address } = useAccount();

  const processingFee = Math.floor(amount * 0.03); // Use Math.floor to get whole number
  const totalAmount = amount + processingFee;

  const validateInput = (value: number) => {
    if (isNaN(value)) {
      setError('Please enter a valid number.');
      return false;
    }

    if (value <= 0) {
      setError('Deposit amount must be greater than zero.');
      return false;
    }

    if (value > 100000) {
      setError('Withdrawal amount cannot exceed 100,000 USD.');
      return false;
    }

    setError('');
    return true;
  };

  const handleWithdraw = async () => {
    if (!isConnected) {
      setError('Please connect to your wallet first.');
      return;
    }

    if (!validateInput(amount)) {
      return; // Prevent submission if input is invalid
    }

    setError(''); // Clear errors before proceeding

    const res = await fetch('/api/withdraw', {
      method: 'POST',
      body: JSON.stringify({ email, amount, totalAmount, address }),
      headers: { 'Content-Type': 'application/json' },
    });
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center p-10">
      <h1 className="text-3xl font-semibold">Withdraw</h1>
      <div className="mt-6 w-full max-w-lg bg-gray-900 p-6 rounded-xl">
        <div className="mb-4 p-4 border border-gray-700 rounded-lg">
          <p className="text-gray-400">PayPal Email</p>
          <input
            type="email"
            className="bg-transparent text-2xl w-full focus:outline-none placeholder-gray-500"
            placeholder="Enter an email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="mb-4 p-4 border border-gray-700 rounded-lg flex justify-between items-center">
          <input
            type="number"
            className="bg-transparent text-2xl w-full focus:outline-none text-white"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            min="1"
            step="1" // Ensures only whole numbers
            placeholder="Enter an amount"
          />
          <span className="text-gray-400">USD</span>
        </div>
        <div className="bg-gray-800 p-4 rounded-lg mt-4">
          <div className="flex justify-between text-gray-400">
            <span>Amount deducted from platform's account</span>
            <span>{totalAmount ?? '0'} USD</span>
          </div>
          <div className="flex justify-between text-gray-400 mt-2">
            <span>Processing fee (3%)</span>
            <span>{processingFee ?? '0'} USD</span>
          </div>
          <div className="flex justify-between text-gray-200 mt-2 font-semibold">
            <span>Amount transferred to your PayPal account</span>
            <span>{amount ?? '0'} USD</span>
          </div>
        </div>
        <button
          className="w-full bg-blue-600 py-2 rounded-lg text-lg font-semibold mt-4 disabled:opacity-50"
          onClick={handleWithdraw}
          disabled={!isConnected || !!error}
        >
          {isConnected ? 'Withdraw' : 'Connect Wallet First'}
        </button>

        {error && <p className="text-red-500 mt-2">{error}</p>}
      </div>
    </div>
  );
}
