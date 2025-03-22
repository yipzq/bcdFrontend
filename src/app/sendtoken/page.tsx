'use client';
import React, { useState } from 'react';

const SendToken: React.FC = () => {
  const [walletAddress, setWalletAddress] = useState<string>('');
  const [amount, setAmount] = useState<string>('0.0');
  const [balance, setBalance] = useState<number>(0);

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAmount(e.target.value);
  };

  const handleConfirm = () => {
    if (parseFloat(amount) > 0 && walletAddress) {
      alert(`Sending ${amount} RMT to ${walletAddress}`);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center p-10">
      <h1 className="text-3xl font-semibold">Send Token</h1>
      <div className="mt-6 w-full max-w-lg bg-gray-900 p-6 rounded-xl">
        <div className="mb-4 p-4 border border-gray-700 rounded-lg">
          <p className="text-gray-400">Send To</p>
          <input
            type="text"
            className="bg-transparent text-2xl w-full focus:outline-none placeholder-gray-500"
            placeholder="Enter a wallet address"
            value={walletAddress}
            onChange={(e) => setWalletAddress(e.target.value)}
          />
        </div>

        <div className="mb-4 p-4 border border-gray-700 rounded-lg">
          <p className="text-gray-400">Enter an amount</p>
          <div className="flex justify-between items-center">
            <input
              type="number"
              className="bg-transparent text-2xl w-full focus:outline-none px-1.5"
              value={amount}
              onChange={handleAmountChange}
            />
            <span className="text-gray-400">RMT</span>
          </div>
          <p className="text-gray-500 text-sm">Balance: {balance}</p>
        </div>

        <button
          className="w-full bg-blue-600 py-2 rounded-lg text-lg font-semibold mt-4 disabled:opacity-50"
          disabled={parseFloat(amount) <= 0 || !walletAddress}
          onClick={handleConfirm}
        >
          Confirm
        </button>
      </div>
    </div>
  );
};

export default SendToken;
