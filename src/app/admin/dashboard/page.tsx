// src/app/admin/dashboard/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminDashboardPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [transactions, setTransactions] = useState<any[]>([]);
  const [tokenFilter, setTokenFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [dateFilter, setDateFilter] = useState('');

  useEffect(() => {
    const storedUsername = sessionStorage.getItem('username');

    const transactionTypeMap = {
      5: 'Withdrawal',
    };

    if (storedUsername) {
      setUsername(storedUsername);
      setIsAuthenticated(true);
      fetchTransactions();
    } else {
      const checkLogin = async () => {
        try {
          const res = await fetch('/api/admin/verify', { method: 'POST' });

          if (!res.ok) {
            router.push('/admin');
            return;
          }

          const data = await res.json();
          setUsername(data.username);
          setIsAuthenticated(true);
          sessionStorage.setItem('username', data.username);
          fetchTransactions();
        } catch {
          router.push('/admin');
        }
      };

      checkLogin();
    }
  }, [router]);

  const fetchTransactions = async () => {
    try {
      const res = await fetch('/api/admin/transactions');
      const data = await res.json();
      setTransactions(data);
    } catch (error) {
      console.error('Failed to fetch transactions:', error);
    }
  };

  const handleLogout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' });
    sessionStorage.removeItem('username');
    router.push('/admin');
  };

  const handleApproval = async (transactionId: number) => {
    try {
      await fetch(`/api/admin/transactions/approve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transactionId }),
      });
      fetchTransactions();
    } catch (error) {
      console.error('Approval failed:', error);
    }
  };

  const handleReject = async (transactionId: number) => {
    try {
      await fetch(`/api/admin/transactions/reject`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transactionId }),
      });
      fetchTransactions();
    } catch (error) {
      console.error('Rejection failed:', error);
    }
  };

  const filteredTransactions = transactions.filter((tx) => {
    const txDate = tx.date?.split('T')[0] ?? '';

    const matchStatus = statusFilter === 'All' || tx.status === statusFilter;
    const matchDate = dateFilter === '' || txDate === dateFilter;
    const matchToken =
      tokenFilter === 'All'
        ? true
        : tokenFilter === 'USD'
        ? tx.amountUSD != null
        : tx.amountToken != null;

    return matchStatus && matchDate && matchToken;
  });

  const transactionTypeMap = {
    5: 'Withdrawal',
  };

  return (
    <div className="min-h-screen bg-black text-white p-6 relative">
      <button
        className="absolute top-4 right-4 px-4 py-2 bg-red-600 rounded hover:bg-red-500"
        onClick={handleLogout}
      >
        Logout
      </button>

      <h1 className="text-3xl font-semibold mb-10">
        Welcome back, {username}!
      </h1>

      {/* Filters */}
      <div className="flex gap-4 mb-4">
        <select
          className="bg-gray-800 p-2 rounded"
          value={tokenFilter}
          onChange={(e) => setTokenFilter(e.target.value)}
        >
          <option value="All">All Types</option>
          <option value="RMT">RMT</option>
          <option value="USD">USD</option>
        </select>
        <select
          className="bg-gray-800 p-2 rounded"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="All">All Status</option>
          <option value="Pending">Pending</option>
          <option value="Completed">Completed</option>
          <option value="Approved">Approved</option>
          <option value="Rejected">Rejected</option>
        </select>
        <input
          type="date"
          className="bg-gray-800 p-2 rounded"
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
        />
      </div>

      <table className="w-full mt-4 border-collapse text-center">
        <thead>
          <tr className="bg-gray-800">
            <th className="p-2">Type</th>
            <th className="p-2">USD</th>
            <th className="p-2">RMT</th>
            <th className="p-2">Sender</th>
            <th className="p-2">Recipient</th>
            <th className="p-2">Status</th>
            <th className="p-2">Date & Time</th>
            <th className="p-2">Approval</th>
          </tr>
        </thead>
        <tbody>
          {filteredTransactions.length > 0 ? (
            filteredTransactions.map((tx, index) => (
              <tr key={index} className="border-b border-gray-700">
                <td className="p-2">
                  {/* Displaying the mapped transaction type */}
                  {transactionTypeMap[
                    tx.type as keyof typeof transactionTypeMap
                  ] || 'Unknown'}
                </td>
                <td className="p-2 text-green-500">{tx.amountUSD ?? '-'}</td>
                <td className="p-2 text-purple-400">
                  {tx.amountToken != null
                    ? Number(tx.amountToken).toFixed(2)
                    : '-'}
                </td>
                <td className="p-2">{tx.sender ?? '-'}</td>
                <td className="p-2">
                  {tx.recipient
                    ? `${tx.recipient.slice(0, 6)}...${tx.recipient.slice(-6)}`
                    : '-'}
                </td>
                <td className="p-2">
                  {tx.status === 'Pending' ? (
                    <span className="text-yellow-400">{tx.status}</span>
                  ) : tx.status === 'Completed' || tx.status === 'Approved' ? (
                    <span className="text-green-400">{tx.status}</span>
                  ) : tx.status === 'Rejected' ? (
                    <span className="text-red-500">{tx.status}</span>
                  ) : (
                    <span>{tx.status}</span>
                  )}
                </td>

                <td className="p-2">
                  {new Date(tx.date)
                    .toISOString()
                    .replace('T', ' ')
                    .replace('.000Z', '') + ' UTC'}
                </td>

                <td className="p-2">
                  {tx.status === 'Pending' ? (
                    <div className="flex gap-2 justify-center">
                      <button
                        className="bg-green-600 px-2 py-1 rounded hover:bg-green-500 text-sm"
                        onClick={() => handleApproval(tx.id)}
                      >
                        Approve
                      </button>
                      <button
                        className="bg-red-600 px-2 py-1 rounded hover:bg-red-500 text-sm"
                        onClick={() => handleReject(tx.id)}
                      >
                        Reject
                      </button>
                    </div>
                  ) : (
                    'N/A'
                  )}
                </td>
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
}
