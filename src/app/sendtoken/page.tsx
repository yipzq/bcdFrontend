"use client";
import React, { useState } from "react";
import { useAccount, useWalletClient, erc20ABI } from "wagmi";
import { parseUnits } from "viem";

const SendToken: React.FC = () => {
  const [walletAddress, setWalletAddress] = useState<string>("");
  const [amount, setAmount] = useState<string>("0");
  const [balance, setBalance] = useState<number>(100); // Example balance (should be fetched from the blockchain)
  const [error, setError] = useState<string>("");

  const { isConnected } = useAccount();
  const { data: walletClient } = useWalletClient();

  // Calculate processing fee (2%)
  const parsedAmount = parseFloat(amount) || 0;
  const processingFee = parsedAmount * 0.02;
  const totalAmount = parsedAmount + processingFee;

  // Ethereum Address Regex (basic check)
  const isValidEthereumAddress = (address: string) =>
    /^0x[a-fA-F0-9]{40}$/.test(address);

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAmount(e.target.value);
  };

  const sendToken = async () => {
    if (!walletClient) {
      setError("Wallet client not available.");
      return;
    }

    try {
      const tokenAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"; // 🔁 Replace this
      const decimals = 18; // 🔁 Replace if needed

      const txHash = await walletClient.writeContract({
        address: tokenAddress as `0x${string}`,
        abi: erc20ABI,
        functionName: "transfer",
        args: [walletAddress, parseUnits(parsedAmount.toString(), decimals)],
      });

      setError("");
      alert(`Transaction sent! Hash: ${txHash}`);
    } catch (err: any) {
      console.error(err);
      setError("Failed to send tokens. Please try again.");
    }
  };

  const handleConfirm = () => {
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

    if (totalAmount > balance) {
      setError(
        "Insufficient balance. Remember to account for the 2% processing fee."
      );
      return;
    }

    // Clear error if everything is valid
    setError("");
    alert(
      `Sending ${parsedAmount.toFixed(
        2
      )} RMT to ${walletAddress} (Total with fee: ${totalAmount.toFixed(
        2
      )} RMT)`
    );
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center p-10">
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
            Balance: {balance.toFixed(2)} RMT
          </p>
        </div>

        {/* Fee Details */}
        <div className="bg-gray-800 p-4 rounded-lg mt-4 mb-4">
          <div className="flex justify-between text-gray-400">
            <span>Send amount</span>
            <span>
              {isNaN(parsedAmount) ? "0.00" : parsedAmount.toFixed(2)} RMT
            </span>
          </div>
          <div className="flex justify-between text-gray-400 mt-2">
            <span>Processing fee (2%)</span>
            <span>
              {isNaN(processingFee) ? "0.00" : processingFee.toFixed(2)} RMT
            </span>
          </div>
          <div className="flex justify-between text-gray-200 mt-2 font-semibold">
            <span>Total amount to be deducted</span>
            <span>
              {isNaN(totalAmount) ? "0.00" : totalAmount.toFixed(2)} RMT
            </span>
          </div>
        </div>

        {/* Confirm Button */}
        <button
          className="w-full bg-blue-600 py-2 rounded-lg text-lg font-semibold mt-4 disabled:opacity-50"
          disabled={!isConnected}
          onClick={handleConfirm}
        >
          {isConnected ? "Confirm" : "Connect Wallet First"}
        </button>

        {/* Error Message */}
        {error && <p className="text-red-500 mt-2">{error}</p>}
      </div>
    </div>
  );
};

export default SendToken;
