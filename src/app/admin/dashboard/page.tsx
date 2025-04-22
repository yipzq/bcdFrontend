// src/app/admin/dashboard/page.tsx

'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminDashboardPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');

  useEffect(() => {
   // Check if the username is stored in sessionStorage
   const storedUsername = sessionStorage.getItem('username');

   if (storedUsername) {
     setUsername(storedUsername);
     setIsAuthenticated(true);
    } else {

      const checkLogin = async () => {
        try {
          // Verify login status by sending a request to the backend
          const res = await fetch('/api/admin/verify', { method: 'POST' });

          // If not authenticated, redirect to login
          if (!res.ok) {
            router.push('/admin');
            return;
          }

          const data = await res.json();
          setUsername(data.username);
          setIsAuthenticated(true);
          sessionStorage.setItem('username', data.username);
        } catch {
          router.push('/admin');
        }
      };

      checkLogin();
    }
  }, [router]);

  const handleLogout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' });
    sessionStorage.removeItem('username'); // Remove username on logout
    router.push('/'); // Redirect after logout
  };

  // Example transactions (needs database integration)
  const transactions = [
    {
      type: 'RMT',
      network: 'TRC20',
      amount: 17100,
      sender: 'TGHjB4kv...S9kF0MxT',
      recipient: 'TLWpBoko...RJaVgCTk',
      status: 'Done',
      date: '2024-10-14 18:12:45',
    },
    {
      type: 'USD',
      network: 'TON',
      amount: 7.0,
      sender: 'EQK9SdfD...u9Tbk72jD',
      recipient: 'EQDpZ9Hq...u0Bk12n9D',
      status: 'Pending',
      date: '2024-10-14 15:50:23',
    },
  ];

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
        <select className="bg-gray-800 p-2 rounded">
          <option>RMT</option>
          <option>USD</option>
        </select>
        <select className="bg-gray-800 p-2 rounded">
          <option>Status</option>
          <option>Pending</option>
          <option>Done</option>
        </select>
        <input type="date" className="bg-gray-800 p-2 rounded" />
      </div>

      <table className="w-full mt-4 border-collapse text-center">
        <thead>
          <tr className="bg-gray-800">
            <th className="p-2">Type</th>
            <th className="p-2">Amount</th>
            <th className="p-2">Sender</th>
            <th className="p-2">Recipient</th>
            <th className="p-2">Status</th>
            <th className="p-2">Date & Time</th>
            <th className="p-2">Approval</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((tx, index) => (
            <tr key={index} className="border-b border-gray-700">
              <td className="p-2">{tx.type}</td>
              <td className="p-2">{tx.amount}</td>
              <td className="p-2">{tx.sender}</td>
              <td className="p-2">{tx.recipient}</td>
              <td className="p-2">
                {tx.status === 'Done' ? (
                  <span className="text-green-400">{tx.status}</span>
                ) : tx.status === 'Pending' ? (
                  <span className="text-yellow-400">{tx.status}</span>
                ) : (
                  <span>{tx.status}</span>
                )}
              </td>
              <td className="p-2">{tx.date}</td>
              <td className="p-2">
                <button
                  className="bg-green-600 px-3 py-1 rounded mr-2 hover:bg-green-500"
                  onClick={() => console.log('Approve clicked')}
                >
                  Approve
                </button>
                <button
                  className="bg-red-600 px-3 py-1 rounded hover:bg-red-500"
                  onClick={() => console.log('Reject clicked')}
                >
                  Reject
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
