'use client';
import React, { useEffect, useState } from 'react';
import { useAccount, useBalance } from 'wagmi';
import { useWallet } from '@/context/WalletContext';

const TokenConverter: React.FC = () => {
  const [amount, setAmount] = useState<string>('0.0');
  const [convertedAmount, setConvertedAmount] = useState<string>('0.0');
  const [balanceUSD, setBalanceUSD] = useState<number>(0);
  const [balanceRMT, setBalanceRMT] = useState<number>(0);
  const [fromToken, setFromToken] = useState<'USD' | 'RMT'>('USD');
  const [toToken, setToToken] = useState<'USD' | 'RMT'>('RMT');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const exchangeRate = 1;

  const { walletAddress, tokenBalance, usdBalance } = useWallet();
  const { isConnected, address } = useAccount();

  useEffect(() => {
    const fetchBalances = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('/api/balances');
        const data = await response.json();
        setBalanceUSD(data.usdBalance);
        setBalanceRMT(data.rmtBalance);
      } catch (error) {
        console.error('Error fetching balances:', error);
        setBalanceUSD(0);
        setBalanceRMT(0);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBalances();
  }, []);

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;

    if (!/^\d*\.?\d*$/.test(value)) return;

    if (value === '') {
      setAmount('');
      setConvertedAmount('0.0');
      return;
    }

    const numericValue = parseFloat(value);
    if (numericValue < 0) {
      setError('Amount cannot be negative.');
      return;
    }

    const maxBalance = fromToken === 'USD' ? usdBalance : tokenBalance;
    if (numericValue > maxBalance) {
      setError(`Insufficient balance. Max: ${maxBalance} ${fromToken}`);
      return;
    }

    setError('');
    setAmount(value);
    setConvertedAmount(
      fromToken === 'USD' && toToken === 'RMT'
        ? (numericValue * exchangeRate).toFixed(2)
        : (numericValue / exchangeRate).toFixed(2)
    );
  };

  const handleSwap = () => {
    setError('');
    setAmount(convertedAmount);
    setConvertedAmount(amount);
    setFromToken(toToken);
    setToToken(fromToken);
  };

  const handleMaxClick = () => {
    const maxBalance = fromToken === 'USD' ? usdBalance : tokenBalance;
    setError('');
    setAmount(maxBalance.toString());
    setConvertedAmount(
      fromToken === 'USD' && toToken === 'RMT'
        ? (maxBalance * exchangeRate).toFixed(2)
        : (maxBalance / exchangeRate).toFixed(2)
    );
  };

  const handleConfirm = async () => {
    if (!isConnected) {
      setError('Please connect to your wallet first.');
      return;
    }

    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      setError('Please enter a valid amount.');
      return;
    }

    const maxBalance = fromToken === 'USD' ? usdBalance : tokenBalance;
    if (numericAmount > maxBalance) {
      setError(`Insufficient balance. Max: ${maxBalance} ${fromToken}`);
      return;
    }

    if (fromToken === 'USD' && toToken === 'RMT') {
      setIsLoading(true);
      try {
        const res = await fetch('/api/update-user-balance', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            amount: numericAmount,
            walletAddress,
          }),
        });

        const result = await res.json();

        if (!res.ok) {
          setError(result.error || 'Failed to convert USD to RMT');
          return;
        }

        setError('');
        window.location.reload();
      } catch (err: any) {
        console.error('Conversion error:', err);
        setError(err?.message || 'Unexpected error during conversion');
      } finally {
        setIsLoading(false);
      }
      return;
    }

    // Optional: Keep RMT ➝ USD logic or move it to backend later
    if (fromToken === 'RMT' && toToken === 'USD') {
      setError('RMT to USD conversion is currently not supported in frontend.');
    }
  };

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
              min="0"
            />
            <button
              className="text-blue-500 px-3 py-1"
              onClick={handleMaxClick}
            >
              Max
            </button>
            <span className="text-gray-400">{fromToken}</span>
          </div>
          <p className="text-gray-500 text-sm">
            Balance: {usdBalance} USD / {tokenBalance} RMT
          </p>
        </div>

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
          <p className="text-gray-500 text-sm">
            Balance: {usdBalance} USD / {tokenBalance} RMT
          </p>
        </div>

        <button
          className="w-full bg-blue-600 py-2 rounded-lg text-lg font-semibold mt-4 disabled:opacity-50"
          onClick={handleConfirm}
          disabled={isLoading || !isConnected}
        >
          {isLoading
            ? 'Processing...'
            : isConnected
            ? 'Convert'
            : 'Connect Wallet First'}
        </button>

        {error && <p className="text-red-500 mt-2">{error}</p>}
      </div>
    </div>
  );
};

export default TokenConverter;
