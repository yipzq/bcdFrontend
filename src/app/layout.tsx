//Prompt message - react-toastify
//fkhadra.github.io/react-toastify/installation

//Change src/app/layout.tsx
// Add import ToastContainer
// Add <ToastContainer />

// import type { Metadata } from 'next';
// import { Inter } from 'next/font/google';
// import './globals.css';

// const inter = Inter({ subsets: ['latin'] });

// import { headers } from 'next/headers'; // added
// import Web3ContextProvider from '@/context/web3';

// import { ToastContainer } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';

// export const metadata: Metadata = {
//   title: 'Liang ICO Program',
//   description: 'Sell Token',
// };

// export default async function RootLayout({
//   children,
// }: Readonly<{
//   children: React.ReactNode;
// }>) {
//   const headersObj = await headers();
//   const cookies = headersObj.get('cookie');

//   return (
//     <html lang="en">
//       <body className={inter.className}>
//         <Web3ContextProvider cookies={cookies}>{children}</Web3ContextProvider>
//         <ToastContainer />
//       </body>
//     </html>
//   );
// }

import '../app/globals.css';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import Web3ContextProvider from '@/context/web3';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-black text-white">
        <Web3ContextProvider cookies={null}>
          <Header />
          <main className="min-h-screen">{children}</main>
          <Footer />
        </Web3ContextProvider>
      </body>
    </html>
  );
}
