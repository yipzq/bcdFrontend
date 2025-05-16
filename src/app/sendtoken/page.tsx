"use client";

import React, { useState, useEffect } from "react";
import { useAccount } from "wagmi";
import { useWallet } from "@/context/WalletContext";
import { print } from "@/utils/toast";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const SendToken: React.FC = () => {
  const [walletAddress, setWalletAddress] = useState<string>("");
  const [amount, setAmount] = useState<string>("0");
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { isConnected } = useAccount();
  const { walletAddress: connectedWalletAddress, tokenBalance } = useWallet();

  // Calculate processing fee 
  const parsedAmount = parseFloat(amount) || 0;
  const processingFee = parsedAmount * 0.01; // 1% fee
  const totalAmount = parsedAmount + processingFee;

  // Fetch token balance when component mounts or wallet changes
  useEffect(() => {
    const fetchTokenBalance = async () => {
      if (!isConnected || !connectedWalletAddress) return;
      
      setIsLoading(true);
      try {
        // Balance is available 
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching token balance:", error);
        setIsLoading(false);
      }
    };

    fetchTokenBalance();
  }, [isConnected, connectedWalletAddress]);

  // Ethereum Address Regex (basic check)
  const isValidEthereumAddress = (address: string) =>
    /^0x[a-fA-F0-9]{40}$/.test(address);

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAmount(e.target.value);
  };

  const handleConfirm = async () => {
    if (!isConnected) {
      setError("Please connect to your wallet first.");
      return;
    }
  
    if (!walletAddress || !isValidEthereumAddress(walletAddress)) {
      setError("Please enter a valid Ethereum wallet address.");
      return;
    }
  
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      setError("Please enter a valid amount greater than zero.");
      return;
    }
  
    if (totalAmount > tokenBalance) {
      setError("Insufficient balance");
      return;
    }
  
    setError("");
    setIsLoading(true);
    
    try {
      const res = await fetch('/api/send-tokens', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: parsedAmount,
          senderWalletAddress: connectedWalletAddress,
          recipientWalletAddress: walletAddress,
        }),
      });
  
      const result = await res.json();
      
      if (!res.ok) {
        setError(result.error || 'Failed to send tokens');
        return;
      }
  
      // Success - using toast instead of alert
      print(`Successfully sent ${parsedAmount.toFixed(2)} RMT to ${walletAddress}`, 'success');
      
      // Wait a moment for the toast to be visible before refreshing
      setTimeout(() => window.location.reload(), 2000);
    } catch (err: any) {
      console.error('Send token error:', err);
      print(err?.message || 'Unexpected error while sending tokens', 'error');
      setError(err?.message || 'Unexpected error while sending tokens');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center p-10">
      {/* Add ToastContainer to render notifications */}
      <ToastContainer 
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
      
      <h1 className="text-3xl font-semibold">Send Token</h1>
      <div className="mt-6 w-full max-w-lg bg-gray-900 p-6 rounded-xl">
        {/* Wallet Address Input */}
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

        {/* Amount Input */}
        <div className="mb-4 p-4 border border-gray-700 rounded-lg">
          <p className="text-gray-400">Enter an amount</p>
          <div className="flex justify-between items-center">
            <input
              type="number"
              className="bg-transparent text-2xl w-full focus:outline-none px-1.5"
              value={amount}
              onChange={handleAmountChange}
              min="0"
              step="0.01"
            />
            <span className="text-gray-400">RMT</span>
          </div>
          <p className="text-gray-500 text-sm">
            Balance: {isLoading ? "Loading..." : `${Math.floor(tokenBalance).toFixed(2)} RMT`}
          </p>
        </div>
        
        {/* Add fee information display */}
        <div className="mt-4 p-4 border border-gray-700 rounded-lg">
          <div className="flex justify-between items-center">
            <span className="text-gray-400">Transfer amount</span>
            <span>{parsedAmount.toFixed(2)} RMT</span>
          </div>
          <div className="flex justify-between items-center mt-2">
            <span className="text-gray-400">Network fee</span>
            <span>{processingFee.toFixed(2)} RMT</span>
          </div>
          <div className="border-t border-gray-700 my-2"></div>
          <div className="flex justify-between items-center font-semibold">
            <span>Total</span>
            <span>{totalAmount.toFixed(2)} RMT</span>
          </div>
        </div>
        
        {/* Confirm Button */}
        <button
          className="w-full bg-blue-600 py-2 rounded-lg text-lg font-semibold mt-4 disabled:opacity-50"
          disabled={!isConnected || isLoading}
          onClick={handleConfirm}
        >
          {isLoading 
            ? "Loading..." 
            : isConnected 
              ? "Confirm" 
              : "Connect Wallet First"}
        </button>

        {/* Error Message */}
        {error && <p className="text-red-500 mt-2">{error}</p>}
      </div>
    </div>
  );
};

export default SendToken;