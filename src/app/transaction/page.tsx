'use client';
import React, { useState } from 'react';
import { FaRegCopy } from 'react-icons/fa';
import { FiExternalLink } from 'react-icons/fi';

const TransactionsPage: React.FC = () => {
  const [status, setStatus] = useState('All');
  const [date, setDate] = useState('');

  const transactions = [
    {
      token: 'RMT',
      network: 'TRC20',
      amount: 17100,
      address: 'TLWpBoko...RJaVgCTk',
      txid: 't67bf9tQ...m96eF01ST',
      status: 'Done',
      date: '2024-10-14 18:12:45',
    },
    {
      token: 'RMT',
      network: 'TON',
      amount: 7.0,
      address: 'EQDpZ9Hq...u0Bk12n9D',
      txid: 'z67fpR6L...n3Fq678k',
      status: 'Done',
      date: '2024-10-14 15:50:23',
    },
    // More transactions
  ];

  const handleExport = () => {
    // Define the CSV headers
    const headers = [
      'Token',
      'Amount',
      'Address',
      'TXID',
      'Status',
      'Date & Time',
    ];

    // Map each transaction to an array of CSV-compatible fields.
    const rows = transactions.map((tx) => [
      'RMT', // Force token to be "RMT"
      tx.amount,
      tx.address,
      tx.txid,
      tx.status,
      tx.date,
    ]);

    // Create CSV string content
    let csvContent = headers.join(',') + '\n';
    rows.forEach((row) => {
      csvContent += row.join(',') + '\n';
    });

    // Create a Blob from the CSV string and generate a download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'transactions.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-black text-white p-6 relative">
      <h1 className="text-3xl font-semibold">Transactions</h1>
      <div className="flex space-x-4 mt-4">
        <select className="bg-gray-900 p-2 rounded-lg" value="RMT" disabled>
          <option value="RMT">RMT</option>
        </select>
        <select
          className="bg-gray-900 p-2 rounded-lg"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="All">All Status</option>
          <option value="Done">Done</option>
          <option value="Pending">Pending</option>
        </select>
        <input
          type="date"
          className="bg-gray-900 p-2 rounded-lg"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
      </div>

      {/* Export button positioned at the top right with padding */}
      <button
        className="absolute top-6 right-6 px-4 py-2 bg-green-600 rounded hover:bg-green-500"
        onClick={handleExport}
      >
        Export (CSV)
      </button>

      <table className="w-full mt-4 border-collapse text-center">
        <thead>
          <tr className="bg-gray-800">
            <th className="p-2">Token</th>
            <th className="p-2">Amount</th>
            <th className="p-2">Address</th>
            <th className="p-2">TXID</th>
            <th className="p-2">Status</th>
            <th className="p-2">Date & Time</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((tx, index) => (
            <tr key={index} className="border-b border-gray-700">
              <td className="p-2">RMT</td>
              <td className="p-2">{tx.amount}</td>
              <td className="p-2">{tx.address}</td>
              <td
                className="p-2 text-blue-400 cursor-pointer"
                onClick={() =>
                  window.open(`https://blockchain.com/tx/${tx.txid}`, '_blank')
                }
              >
                {tx.txid.slice(0, 6)}...{tx.txid.slice(-6)}
              </td>
              <td className="p-2 text-green-400">{tx.status}</td>
              <td className="p-2">{tx.date}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TransactionsPage;
