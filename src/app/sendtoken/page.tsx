import React from 'react';

export default function SendToken() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="bg-white p-6 rounded-lg shadow-lg w-80">
        <h1 className="text-2xl font-bold text-center mb-4">Send Token</h1>
        <input
          className="w-full p-2 border border-gray-300 rounded mb-3 text-black"
          type="text"
          placeholder="Wallet Address"
        />
        <input
          className="w-full p-2 border border-gray-300 rounded mb-3 text-black"
          type="number"
          placeholder="Amount"
        />
        <button className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded transition">
          Confirm
        </button>
      </div>
    </div>
  );
}
