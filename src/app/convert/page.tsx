import React from 'react';

export default function Convert() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-xl p-6 w-80">
        <h1 className="text-2xl font-bold text-center mb-4">Convert Token</h1>

        <input
          className="w-full p-3 border border-gray-300 rounded-lg text-black outline-none focus:ring-2 focus:ring-blue-500"
          type="number"
          placeholder="Enter USD amount"
        />

        <p className="text-center my-3 text-gray-600">⇅</p>

        <input
          className="w-full p-3 border border-gray-300 rounded-lg text-black outline-none focus:ring-2 focus:ring-blue-500"
          type="number"
          placeholder="Converted RMT"
          disabled
        />

        <button className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold mt-4 p-3 rounded-lg transition duration-300">
          Confirm
        </button>
      </div>
    </div>
  );
}
