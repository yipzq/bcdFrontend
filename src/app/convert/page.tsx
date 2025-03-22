'use client';
import React, { useEffect, useState } from 'react';

const TokenConverter: React.FC = () => {
  const [amount, setAmount] = useState<string>('0.0');
  const [convertedAmount, setConvertedAmount] = useState<string>('0.0');
  const [balanceUSD, setBalanceUSD] = useState<number>(0); // Added some balance for testing
  const [balanceRMT, setBalanceRMT] = useState<number>(0); // Added some balance for testing
  const [fromToken, setFromToken] = useState<'USD' | 'RMT'>('USD');
  const [toToken, setToToken] = useState<'USD' | 'RMT'>('RMT');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const exchangeRate = 1; // 1 USD = 1 RMT (Adjust accordingly)

  // Fetch balances from your backend
  useEffect(() => {
    const fetchBalances = async () => {
      setIsLoading(true);
      try {
        // Replace with your actual API endpoint
        const response = await fetch('/api/balances');
        const data = await response.json();

        // Update the state with real balances from your backend
        setBalanceUSD(data.usdBalance);
        setBalanceRMT(data.rmtBalance);
      } catch (error) {
        console.error('Error fetching balances:', error);
        // Optionally set fallback values if API fails
        setBalanceUSD(0);
        setBalanceRMT(0);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBalances();
  }, []); // Empty dependency array means this runs once on component mount
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setAmount(value);

    // Calculate conversion based on current token direction
    if (fromToken === 'USD' && toToken === 'RMT') {
      setConvertedAmount((parseFloat(value) * exchangeRate).toFixed(2));
    } else {
      setConvertedAmount((parseFloat(value) / exchangeRate).toFixed(2));
    }
  };

  // Updated swap function to swap both values and token positions
  const handleSwap = () => {
    // Swap the values
    const temp = amount;
    setAmount(convertedAmount);
    setConvertedAmount(temp);

    // Swap token positions
    const tempToken = fromToken;
    setFromToken(toToken);
    setToToken(tempToken);
  };

  const handleMaxClick = () => {
    // Set max balance based on current fromToken
    const maxBalance = fromToken === 'USD' ? balanceUSD : balanceRMT;
    setAmount(maxBalance.toString());

    // Calculate converted amount based on current token direction
    if (fromToken === 'USD' && toToken === 'RMT') {
      setConvertedAmount((maxBalance * exchangeRate).toFixed(2));
    } else {
      setConvertedAmount((maxBalance / exchangeRate).toFixed(2));
    }
  };

  // Get the current balance based on token type
  const getFromBalance = () => (fromToken === 'USD' ? balanceUSD : balanceRMT);
  const getToBalance = () => (toToken === 'USD' ? balanceUSD : balanceRMT);

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center p-10">
      <h1 className="text-3xl font-semibold">Convert Token</h1>

      <div className="mt-6 w-full max-w-lg bg-gray-900 p-6 rounded-xl">
        <div className="mb-4 p-4 border border-gray-700 rounded-lg">
          <p className="text-gray-400">From</p>
          <div className="flex justify-between items-center">
            <input
              type="number"
              className="bg-transparent text-2xl w-full focus:outline-none"
              value={amount}
              onChange={handleAmountChange}
            />
            <button
              className="text-blue-500 px-3 py-1"
              onClick={handleMaxClick}
            >
              Max
            </button>
            <span className="text-gray-400">{fromToken}</span>
          </div>
          <p className="text-gray-500 text-sm">Balance: {getFromBalance()}</p>
        </div>

        {/* Swap button */}
        <div className="flex justify-center w-full">
          <button
            onClick={handleSwap}
            className="flex justify-center items-center w-10 h-10 my-2 bg-gray-800 rounded-full text-gray-400 cursor-pointer hover:bg-gray-700"
          >
            ↕
          </button>
        </div>

        <div className="mb-4 p-4 border border-gray-700 rounded-lg">
          <p className="text-gray-400">To</p>
          <div className="flex justify-between items-center">
            <input
              type="number"
              className="bg-transparent text-2xl w-full focus:outline-none"
              value={convertedAmount}
              readOnly
            />
            <span className="text-gray-400">{toToken}</span>
          </div>
          <p className="text-gray-500 text-sm">Balance: {getToBalance()}</p>
        </div>

        <button
          className="w-full bg-blue-600 py-2 rounded-lg text-lg font-semibold mt-4 disabled:opacity-50"
          disabled={parseFloat(amount) <= 0}
        >
          Confirm
        </button>
      </div>
    </div>
  );
};

export default TokenConverter;
