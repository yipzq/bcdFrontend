// import Image from 'next/image';
// import Link from 'next/link';
// import { Connect } from './Connect';
// import React from 'react';

// export function Header() {
//   return (
//     <nav className="flex justify-between items-center p-4 bg-gray-900 text-white w-full">
//       <Link href="/">
//         <Image src="/logo.png" alt="RMT Logo" width={40} height={35} />
//       </Link>

//       <div className="absolute left-1/2 transform -translate-x-1/2 flex space-x-6">
//         <Link href="/">Home</Link>
//         <Link href="/deposit">Deposit</Link>
//         <Link href="/convert">Convert</Link>
//         <Link href="/sendtoken">Send Token</Link>
//         <Link href="/transaction">Transaction</Link>
//       </div>

//       <div className="w-[100px] flex justify-end">
//         <Connect />
//       </div>
//     </nav>
//   );
// }

'use client';
import Image from 'next/image';
import Link from 'next/link';
import { Connect } from './Connect';
import React, { useState, useEffect } from 'react';

export function Header() {
  const [usdBalance] = useState(0); // Set RMT to 0 for now
  const [rmtBalance] = useState(0); // Set RMT to 0 for now

  return (
    <nav className="flex justify-between items-center p-4 bg-gray-900 text-white w-full">
      <Link href="/">
        <Image src="/logo.png" alt="RMT Logo" width={40} height={35} />
      </Link>

      {/* Centered Navigation Links */}
      <div className="absolute left-1/2 transform -translate-x-1/2 flex space-x-6">
        <Link href="/">Home</Link>
        <Link href="/deposit">Deposit</Link>
        <Link href="/convert">Convert</Link>
        <Link href="/sendtoken">Send Token</Link>
        <Link href="/transaction">Transaction</Link>
      </div>

      <div className="flex items-center space-x-4">
        <div className="bg-gray-800 px-4 py-2 rounded-full shadow-md border border-gray-600 flex space-x-3 items-center">
          <span className="text-yellow-300 font-bold">
            USD {usdBalance.toFixed(2)}
          </span>
          <span className="text-purple-400 font-bold">
            RMT {rmtBalance.toFixed(2)}
          </span>
        </div>
        <Connect />
      </div>
    </nav>
  );
}
