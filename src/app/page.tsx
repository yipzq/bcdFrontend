//src/app/page.tsx

'use client';

import React from 'react';
// import { Header } from './components/Header';
// import { Footer } from './components/Footer';
// import { BuyToken } from './components/BuyToken';

// export default function Home() {
//   return (
//     <>
//       <div className="flex flex-col min-h-screen">
//         <Header />
//         <BuyToken />
//         <Footer />
//       </div>
//     </>
//   );
// }

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-4xl font-bold">
        Welcome to Remittance Token Platform
      </h1>
      <p className="mt-2 text-black-300">Secure and fast token transactions.</p>
    </div>
  );
}
