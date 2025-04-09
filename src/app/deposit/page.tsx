// export default function Deposit() {
//   const [amount, setAmount] = useState('');
//   const [error, setError] = useState('');

//   const depositAmount = parseFloat(amount) || 0;
//   const processingFee = (depositAmount * 0.02).toFixed(2);
//   const totalAmount = (depositAmount + parseFloat(processingFee)).toFixed(2);

//   const router = useRouter();

//   const handleSubmit = () => {
//     if (depositAmount <= 0) {
//       setError('Please enter a valid amount.');
//       return;
//     }

//     // ✅ Store data in localStorage instead of API call
//     localStorage.setItem('totalAmount', totalAmount);

//     // ✅ Navigate to confirmation page
//     router.push('/payment');
//   };

//   return (
//     <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
//       <div className="bg-white p-6 rounded-lg shadow-md w-96">
//         <h1 className="text-2xl font-bold text-center mb-4">Deposit</h1>
//         <input
//           className="w-full p-2 border border-gray-300 rounded mb-4"
//           type="number"
//           placeholder="Enter amount (USD)"
//           value={amount}
//           onChange={(e) => setAmount(e.target.value)}
//         />
//         <div className="bg-gray-100 p-4 rounded">
//           <p className="flex justify-between">
//             <span>Deposit amount:</span>{' '}
//             <span>{depositAmount.toFixed(2)} USD</span>
//           </p>
//           <p className="flex justify-between">
//             <span>Processing fee (2%):</span>{' '}
//             <span>{!isNaN(depositAmount) ? processingFee : '0.00'} USD</span>
//           </p>
//           <p className="flex justify-between font-bold">
//             <span>Total amount:</span>{' '}
//             <span>{!isNaN(depositAmount) ? totalAmount : '0.00'} USD</span>
//           </p>
//         </div>
//         <button
//           className="w-full bg-blue-500 text-white mt-4 p-2 rounded font-bold"
//           onClick={handleSubmit}
//         >
//           {/* When click pay need stripe api to continue the transactions  */}
//           Pay
//         </button>
//         {error && <p className="text-red-500 mb-4">{error}</p>}
//       </div>
//     </div>
//   );
// }

// 'use client';
// import React, { useState } from 'react';
// import { useRouter } from 'next/navigation';

// const DepositToken: React.FC = () => {
//   const [amount, setAmount] = useState<string>("100");
//   const [error, setError] = useState('');
//   const depositAmount = parseFloat(amount) || 0;
//   const processingFee = depositAmount * 0.02;
//   const totalAmount = depositAmount + processingFee;

//   const router = useRouter();

//   const handleSubmit = () => {
//     if (depositAmount <= 0) {
//       setError('Please enter a valid amount.');
//       return;
//     }

//     // ✅ Store data in localStorage instead of API call
//     localStorage.setItem('totalAmount', totalAmount.toString());

//     // ✅ Navigate to confirmation page
//     router.push('/payment');
//   };

//   return (
//     <div className="min-h-screen bg-black text-white flex flex-col items-center p-10">
//       <h1 className="text-3xl font-semibold">Deposit</h1>
//       <div className="mt-6 w-full max-w-lg bg-gray-900 p-6 rounded-xl">
//         <div className="mb-4 p-4 border border-gray-700 rounded-lg flex justify-between items-center">
//           <input
//             type="number"
//             className="bg-transparent text-2xl w-full focus:outline-none text-white"
//             value={amount}
//             onChange={(e) => setAmount(e.target.value)}
//           />
//           <span className="text-gray-400">USD</span>
//         </div>

//         <div className="bg-gray-800 p-4 rounded-lg mt-4">
//           <div className="flex justify-between text-gray-400">
//             <span>Deposit amount</span>
//             <span>{depositAmount.toFixed(2)} USD</span>
//           </div>
//           <div className="flex justify-between text-gray-400 mt-2">
//             <span>Processing fee (2%)</span>
//             <span>{processingFee.toFixed(2)} USD</span>
//           </div>
//           <div className="flex justify-between text-gray-200 mt-2 font-semibold">
//             <span>Total amount to be paid</span>
//             <span>{totalAmount.toFixed(2)} USD</span>
//           </div>
//         </div>

//         <button className="w-full bg-blue-600 py-2 rounded-lg text-lg font-semibold mt-4 disabled:opacity-50"
//           onClick={handleSubmit}>
//           Pay
//         </button>
//         {error && <p className="text-red-500 mb-4">{error}</p>}
//       </div>
//     </div>
//   );
// };

// export default DepositToken;

"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAccount } from "wagmi";

const DepositToken: React.FC = () => {
  const [amount, setAmount] = useState<string>("100");
  const [error, setError] = useState<string>("");

  const router = useRouter();
  const { isConnected } = useAccount();

  const depositAmount = parseFloat(amount.trim()); // Trim to avoid empty spaces
  const processingFee = depositAmount * 0.02;
  const totalAmount = depositAmount + processingFee;

  const validateInput = (value: string) => {
    if (value.trim() === "") {
      setError("Amount cannot be empty.");
      return false;
    }

    const numericValue = parseFloat(value);
    if (isNaN(numericValue)) {
      setError("Please enter a valid number.");
      return false;
    }

    if (numericValue <= 0) {
      setError("Deposit amount must be greater than zero.");
      return false;
    }

    const computedTotal = numericValue + numericValue * 0.02;
    if (computedTotal > 999999.99) {
      setError("Total amount (including fee) cannot exceed 999,999.99 USD.");
      return false;
    }

    setError("");
    return true;
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setAmount(value);
    validateInput(value); // Validate while typing
  };

  const handleSubmit = () => {
    if (!isConnected) {
      setError("Please connect to your wallet first.");
      return;
    }

    if (!validateInput(amount)) {
      return; // Prevent submission if input is invalid
    }

    setError(""); // Clear errors before proceeding
    localStorage.setItem("totalAmount", totalAmount.toString());
    router.push("/payment");
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center p-10">
      <h1 className="text-3xl font-semibold">Deposit</h1>
      <div className="mt-6 w-full max-w-lg bg-gray-900 p-6 rounded-xl">
        <div className="mb-4 p-4 border border-gray-700 rounded-lg flex justify-between items-center">
          <input
            type="number"
            className="bg-transparent text-2xl w-full focus:outline-none text-white"
            value={amount}
            onChange={handleAmountChange}
            min="0"
          />
          <span className="text-gray-400">USD</span>
        </div>

        <div className="bg-gray-800 p-4 rounded-lg mt-4">
          <div className="flex justify-between text-gray-400">
            <span>Deposit amount</span>
            <span>
              {isNaN(depositAmount) ? "0.00" : depositAmount.toFixed(2)} USD
            </span>
          </div>
          <div className="flex justify-between text-gray-400 mt-2">
            <span>Processing fee (2%)</span>
            <span>
              {isNaN(processingFee) ? "0.00" : processingFee.toFixed(2)} USD
            </span>
          </div>
          <div className="flex justify-between text-gray-200 mt-2 font-semibold">
            <span>Total amount to be paid</span>
            <span>
              {isNaN(totalAmount) ? "0.00" : totalAmount.toFixed(2)} USD
            </span>
          </div>
        </div>

        <button
          className="w-full bg-blue-600 py-2 rounded-lg text-lg font-semibold mt-4 disabled:opacity-50"
          onClick={handleSubmit}
          disabled={!isConnected || !!error}
        >
          {isConnected ? "Pay" : "Connect Wallet First"}
        </button>

        {error && <p className="text-red-500 mt-2">{error}</p>}
      </div>
    </div>
  );
};

export default DepositToken;
