// app/components/Header.tsx

// import React from 'react';
// import { Connect } from './Connect';

// export function Header() {
//   return (
//     <header className="navbar flex justify-between p-4 pt-0">
//       <h1 className="text-xl font-bold">😊</h1>
//       <div className="flex gap-2">
//         <Connect />
//       </div>
//     </header>
//   );
// }

import Image from 'next/image';
import Link from 'next/link';
import { Connect } from './Connect';
import React from 'react';

export function Header() {
  return (
    <nav className="flex justify-between items-center p-4 bg-gray-900 text-white w-full">
      <Link href="/">
        <Image src="/logo.png" alt="RMT Logo" width={40} height={35} />
      </Link>

      <div className="absolute left-1/2 transform -translate-x-1/2 flex space-x-6">
        <Link href="/">Home</Link>
        <Link href="/deposit">Deposit</Link>
        <Link href="/convert">Convert</Link>
        <Link href="/sendtoken">Send Token</Link>
        <Link href="/transaction">Transaction</Link>
      </div>

      <div className="w-[100px] flex justify-end">
        <Connect />
      </div>
    </nav>
  );
}
