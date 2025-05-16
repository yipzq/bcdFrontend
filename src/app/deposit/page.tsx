'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAccount } from 'wagmi';
import { useWallet } from '@/context/WalletContext';

const DepositToken: React.FC = () => {
  const [amount, setAmount] = useState<string>('');
  const [error, setError] = useState<string>('');

  const router = useRouter();
  const { isConnected } = useAccount();

  // Parse as integer instead of float
  const depositAmount = parseInt(amount.trim()) || 0;
  const processingFee = depositAmount * 0.05;
  const totalAmount = depositAmount + processingFee;

  const validateInput = (value: string) => {
    // Check if the input is empty
    if (value.trim() === '') {
      setError('Amount cannot be empty.');
      return false;
    }

    // Only allow digits (whole numbers)
    if (!/^\d+$/.test(value)) {
      setError('Please enter an amount');
      return false;
    }

    const numericValue = parseInt(value);
    if (isNaN(numericValue)) {
      setError('Please enter a valid number.');
      return false;
    }

    if (numericValue <= 0) {
      setError('Deposit amount must be greater than zero.');
      return false;
    }

    const computedTotal = numericValue + Math.floor(numericValue * 0.05);
    if (computedTotal > 999999) {
      setError('Total amount (including fee) cannot exceed 999,999 USD.');
      return false;
    }

    setError('');
    return true;
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;

    // Only allow digits
    if (value !== '' && !/^\d*$/.test(value)) {
      return;
    }

    // Limit to 6 digits
    if (value.length > 6) {
      value = value.slice(0, 6);
    }

    setAmount(value);
    validateInput(value); // Validate while typing
  };

  const handleSubmit = () => {
    if (!isConnected) {
      setError('Please connect to your wallet first.');
      return;
    }

    if (!validateInput(amount)) {
      return; // Prevent submission if input is invalid
    }

    setError(''); // Clear errors before proceeding
    localStorage.setItem('depositAmount', depositAmount.toString());
    localStorage.setItem('totalAmount', totalAmount.toString());
    router.push('/payment');
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center p-10">
      <h1 className="text-3xl font-semibold">Deposit</h1>
      <div className="mt-6 w-full max-w-lg bg-gray-900 p-6 rounded-xl">
        <div className="mb-4 p-4 border border-gray-700 rounded-lg flex justify-between items-center">
          <input
            type="number"
            className="bg-transparent text-2xl w-full focus:outline-none text-white"
            value={amount}
            onChange={handleAmountChange}
            min="1"
            step="1" // Ensures only whole numbers
            placeholder="Enter an amount"
          />
          <span className="text-gray-400">USD</span>
        </div>

        <div className="bg-gray-800 p-4 rounded-lg mt-4">
          <div className="flex justify-between text-gray-400">
            <span>Deposit amount</span>
            <span>
              {isNaN(depositAmount) ? '0.00' : depositAmount.toFixed(2)} USD
            </span>
          </div>
          <div className="flex justify-between text-gray-400 mt-2">
            <span>Processing fee (5%)</span>
            <span>
              {isNaN(processingFee) ? '0.00' : processingFee.toFixed(2)} USD
            </span>
          </div>
          <div className="flex justify-between text-gray-200 mt-2 font-semibold">
            <span>Total amount to be paid</span>
            <span>
              {isNaN(totalAmount) ? '0.00' : totalAmount.toFixed(2)} USD
            </span>
          </div>
        </div>

        <button
          className="w-full bg-blue-600 py-2 rounded-lg text-lg font-semibold mt-4 disabled:opacity-50"
          onClick={handleSubmit}
          disabled={!isConnected || !!error}
        >
          {isConnected ? 'Pay' : 'Connect Wallet First'}
        </button>

        {error && <p className="text-red-500 mt-2">{error}</p>}
      </div>
    </div>
  );
};

export default DepositToken;
