// src/app/transaction/page.tsx

'use client';
import React, { useState, useEffect } from 'react';
import { useWallet } from '@/context/WalletContext';

interface Transaction {
  transactionID: number;
  amountUSD: number;
  amountToken: number;
  reference: string;
  status: string;
  transactionDateTime: string;
  transactionType: string;
  initiator: string;
  recipient: string;
  direction: 'incoming' | 'outgoing' | 'other';
}

const TransactionsPage: React.FC = () => {
  const [status, setStatus] = useState('All');
  const [date, setDate] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [transactionHistory, setTransactionHistory] = useState<Transaction[]>(
    []
  );
  const [tokenFilter, setTokenFilter] = useState('All');
  const { walletAddress } = useWallet();

  const validStatuses = ['All', 'Completed', 'Pending', 'Approved', 'Rejected'];

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedDate = e.target.value;
    const today = new Date().toISOString().split('T')[0];

    if (selectedDate > today) {
      setError('Future dates are not allowed.');
      return;
    }

    setError(null);
    setDate(selectedDate);
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedStatus = e.target.value;
    if (!validStatuses.includes(selectedStatus)) {
      setError('Invalid status selected.');
      return;
    }

    setError(null);
    setStatus(selectedStatus);
  };

  const handleTokenChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setTokenFilter(e.target.value);
  };

  async function getTransactionHistory() {
    try {
      const response = await fetch(
        `../api/transaction?walletAddress=${walletAddress}`
      );
      const data = await response.json();
      setTransactionHistory(data);
    } catch (err) {
      setError('Failed to fetch transaction history.');
    }
  }

  useEffect(() => {
    if (walletAddress) {
      getTransactionHistory();
    }
  }, [walletAddress]);

  const filteredTransactions = transactionHistory.filter((tx) => {
    const txDate = tx.transactionDateTime.split('T')[0];

    const matchStatus = status === 'All' || tx.status === status;
    const matchDate = date === '' || txDate === date;
    const matchToken =
      tokenFilter === 'All'
        ? true
        : tokenFilter === 'USD'
        ? tx.amountUSD !== null && tx.amountUSD !== undefined
        : tx.amountToken !== null && tx.amountToken !== undefined;

    return matchStatus && matchDate && matchToken;
  });

  return (
    <div className="min-h-screen bg-black text-white p-6 relative">
      <h1 className="text-3xl font-semibold">Transactions</h1>

      <div className="flex space-x-4 mt-4">
        <select
          className="bg-gray-900 p-2 rounded-lg"
          value={tokenFilter}
          onChange={handleTokenChange}
        >
          <option value="All">All Types</option>
          <option value="RMT">RMT</option>
          <option value="USD">USD</option>
        </select>

        <select
          className="bg-gray-900 p-2 rounded-lg"
          value={status}
          onChange={handleStatusChange}
        >
          <option value="All">All Status</option>
          <option value="Completed">Completed</option>
          <option value="Pending">Pending</option>
          <option value="Approved">Approved</option>
          <option value="Rejected">Rejected</option>
        </select>

        <input
          type="date"
          className="bg-gray-900 p-2 rounded-lg"
          value={date}
          onChange={handleDateChange}
        />
      </div>

      {error && <p className="text-red-500 mt-2">{error}</p>}

      <table className="w-full mt-4 border-collapse text-center">
        <thead>
          <tr className="bg-gray-800">
            <th className="p-2">No.</th>
            <th className="p-2">Type</th>
            <th className="p-2">USD</th>
            <th className="p-2">RMT</th>
            <th className="p-2">Recipient</th>
            <th className="p-2">Reference</th>
            <th className="p-2">Status</th>
            <th className="p-2">Date & Time</th>
          </tr>
        </thead>
        <tbody>
          {filteredTransactions.length > 0 ? (
            filteredTransactions.map((tx, index) => (
              <tr key={index} className="border-b border-gray-700">
                <td className="p-2">{index + 1}</td>
                <td className="p-2">{tx.transactionType}</td>
                <td
                  className={`p-2 ${
                    tx.transactionType === 'Deposit' ||
                    tx.transactionType === 'Burn'
                      ? 'text-green-500'
                      : tx.transactionType === 'Withdraw' ||
                        tx.transactionType === 'Mint'
                      ? 'text-red-500'
                      : ''
                  }`}
                >
                  {tx.amountUSD ?? '-'}
                </td>
                <td
                  className={`p-2 ${
                    tx.transactionType === 'Mint'
                      ? 'text-green-500'
                      : tx.transactionType === 'Burn'
                      ? 'text-red-500'
                      : tx.direction === 'incoming'
                      ? 'text-green-500'
                      : tx.direction === 'outgoing'
                      ? 'text-red-500'
                      : ''
                  }`}
                >
                  {tx.amountToken != null
                    ? Number(tx.amountToken).toFixed(2)
                    : '-'}
                </td>
                <td className="p-2">
                  {tx.recipient ? (
                    <>
                      {tx.recipient.slice(0, 6)}...{tx.recipient.slice(-6)}
                      {tx.recipient === walletAddress && ' (You)'}
                    </>
                  ) : (
                    '-'
                  )}
                </td>
                <td className="p-2">{tx.reference ?? '-'}</td>
                <td className="p-2">
                  {tx.status === 'Approved' ? (
                    <span className="text-green-400">{tx.status}</span>
                  ) : tx.status === 'Rejected' ? (
                    <span className="text-red-400">{tx.status}</span>
                  ) : tx.status === 'Pending' ? (
                    <span className="text-yellow-400">{tx.status}</span>
                  ) : (
                    tx.status
                  )}
                </td>
                <td className="p-2">{tx.transactionDateTime}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={8} className="p-4 text-gray-400">
                No transactions found for selected filter.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default TransactionsPage;
