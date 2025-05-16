'use client';

import { useState } from 'react';
import { useAccount } from 'wagmi';

export default function WithdrawButton() {
  const [email, setEmail] = useState('');
  const [amount, setAmount] = useState('');
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState(false); // NEW
  const { isConnected, address } = useAccount();

  const numericAmount = parseFloat(amount) || 0;
  const calculatedFee = numericAmount * 0.03;
  const processingFee =
    numericAmount > 0 && calculatedFee < 1 ? 1 : calculatedFee;
  const totalAmount = numericAmount + processingFee;

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validateInput = (value: string) => {
    if (!value) {
      setError('Please enter an amount.');
      return false;
    }
    const num = parseFloat(value);
    if (isNaN(num)) {
      setError('Please enter a valid number.');
      return false;
    }
    if (num <= 0) {
      setError('Withdrawal amount must be greater than zero.');
      return false;
    }
    if (num > 60000) {
      setError('Withdrawal amount cannot exceed 60,000 USD.');
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

    if (!validateEmail(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    if (!validateInput(amount)) {
      return;
    }

    setError('');
    setLoading(true); // Start loading

    try {
      const res = await fetch('/api/withdraw', {
        method: 'POST',
        body: JSON.stringify({
          email,
          amount: numericAmount,
          totalAmount,
          address,
        }),
        headers: { 'Content-Type': 'application/json' },
      });

      if (res.ok) {
        if (Number(amount) < 10000) {
          alert(
            'Withdrawal successful! Funds are being transferred to your PayPal account.'
          );
          window.location.reload();
        } else {
          alert(
            'Withdrawal request has been submitted. Funds above $10,000 need approval from the admin.'
          );
          setEmail('');
          setAmount('');
          setError('');
        }
      } else {
        const errorData = await res.json();
        setError(errorData.error || 'Withdrawal failed.');
      }
    } catch (err) {
      setError('Something went wrong.');
    } finally {
      setLoading(false); // Stop loading
    }
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value;

    val = val.replace(/[^0-9.]/g, '');
    const firstDotIndex = val.indexOf('.');
    if (firstDotIndex !== -1) {
      val =
        val.slice(0, firstDotIndex + 1) +
        val.slice(firstDotIndex + 1).replace(/\./g, '');
    }

    const parts = val.split('.');
    parts[0] = parts[0].replace(/^0+(?=\d)/, '');
    if (parts[0].length > 5) {
      parts[0] = parts[0].slice(0, 5);
    }
    if (parts[1]) {
      parts[1] = parts[1].slice(0, 2);
      val = parts[0] + '.' + parts[1];
    } else {
      val = parts[0];
    }

    setAmount(val);
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
            type="text"
            className="bg-transparent text-2xl w-full focus:outline-none text-white"
            value={amount}
            onChange={handleAmountChange}
            placeholder="Enter an amount"
          />
          <span className="text-gray-400">USD</span>
        </div>
        <div className="bg-gray-800 p-4 rounded-lg mt-4">
          <div className="flex justify-between text-gray-400">
            <span>Amount deducted from platform's account</span>
            <span>{totalAmount.toFixed(2)} USD</span>
          </div>
          <div className="flex justify-between text-gray-400 mt-2">
            <span>Processing fee (3%)</span>
            <span>{processingFee.toFixed(2)} USD</span>
          </div>
          <div className="flex justify-between text-gray-200 mt-2 font-semibold">
            <span>Amount transferred to your PayPal account</span>
            <span>{numericAmount.toFixed(2)} USD</span>
          </div>
        </div>
        <button
          className="w-full bg-blue-600 py-2 rounded-lg text-lg font-semibold mt-4 disabled:opacity-50"
          onClick={handleWithdraw}
          disabled={!isConnected || numericAmount <= 0 || loading}
        >
          {loading
            ? 'Processing...'
            : isConnected
            ? 'Withdraw'
            : 'Connect Wallet First'}
        </button>

        {error && <p className="text-red-500 mt-2">{error}</p>}
      </div>
    </div>
  );
}
