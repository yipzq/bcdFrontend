// 'use client';
// import Image from 'next/image';
// import Link from 'next/link';
// import { Connect } from './Connect';
// import React, { useState, useEffect } from 'react';

// export function Header() {
//   const [usdBalance] = useState(0); // Set RMT to 0 for now
//   const [rmtBalance] = useState(0); // Set RMT to 0 for now

//   return (
//     <nav className="flex justify-between items-center p-4 bg-gray-900 text-white w-full">
//       <Link href="/">
//         <Image src="/logo.png" alt="RMT Logo" width={40} height={35} />
//       </Link>

//       {/* Centered Navigation Links */}
//       <div className="absolute left-1/2 transform -translate-x-1/2 flex space-x-6">
//         <Link href="/">Home</Link>
//         <Link href="/deposit">Deposit</Link>
//         <Link href="/convert">Convert</Link>
//         <Link href="/sendtoken">Send Token</Link>
//         <Link href="/transaction">Transaction</Link>
//         <Link href="/admin/login">Admin</Link>
//       </div>

//       <div className="flex items-center space-x-4">
//         <div className="bg-gray-800 px-4 py-2 rounded-full shadow-md border border-gray-600 flex space-x-3 items-center">
//           <span className="text-yellow-300 font-bold">
//             USD {usdBalance.toFixed(2)}
//           </span>
//           <span className="text-purple-400 font-bold">
//             RMT {rmtBalance.toFixed(2)}
//           </span>
//         </div>
//         <Connect />
//       </div>
//     </nav>
//   );
// }

'use client';
import Image from 'next/image';
import Link from 'next/link';
import { Connect } from './Connect';
import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { ethers } from 'ethers';
import { useWallet } from '@/context/WalletContext';
import { useAccount } from 'wagmi';

export function Header() {
  //const [accountDetails, setAccountDetails] = useState<any[] | null>(null);
  //const [tokenBalance, setTokenBalance] = useState<number | null>(null);
  const tokenAddress = '0x5FbDB2315678afecb367f032d93F642f64180aa3';
  const {
    walletAddress,
    setWalletAddress,
    tokenBalance,
    setTokenBalance,
    usdBalance,
    setUsdBalance,
  } = useWallet();
  const { isConnected, address } = useAccount();
  const didMount = useRef(false);

  const router = useRouter();

  const handleAdminClick = () => {
    router.push('/admin/login');
  };

  const getConnectedWalletAddress = async () => {
    if (typeof window !== 'undefined' && window.ethereum) {
      // Type assertion to Eip1193Provider
      const provider = new ethers.BrowserProvider(
        window.ethereum as unknown as ethers.Eip1193Provider
      );

      // Fetch connected accounts
      const accounts = await provider.listAccounts();

      if (accounts.length > 0) {
        const address = accounts[0].address;
        setWalletAddress(accounts[0].address);
        return address;
      } else {
        console.log('No wallet connected');
        return null;
      }
    } else {
      console.log('Ethereum provider not found');
      return null;
    }
  };

  async function getPageData(address: string) {
    const response = await fetch(`../api/useraccount?walletAddress=${address}`);
    const res = await response.json();
    setUsdBalance(res.useraccounts[0].balance);
  }

  const erc20ABI = [
    'function balanceOf(address owner) view returns (uint256)',
    'function decimals() view returns (uint8)',
  ];

  const getTokenBalance = async (
    walletAddress: string,
    tokenAddress: string,
    provider: ethers.BrowserProvider
  ) => {
    const tokenContract = new ethers.Contract(tokenAddress, erc20ABI, provider);
    const rawBalance = await tokenContract.balanceOf(walletAddress);
    const decimals = await tokenContract.decimals();
    return Number(ethers.formatUnits(rawBalance, decimals));
  };

  const fetchWalletAndTokenData = async () => {
    const address = await getConnectedWalletAddress(); //get wallet address
    if (address) {
      getPageData(address); //get USD balance

      const provider = new ethers.BrowserProvider(
        window.ethereum as unknown as ethers.Eip1193Provider
      );
      const balance = await getTokenBalance(address, tokenAddress, provider); //get token balance
      setTokenBalance(balance);
    }
  };

  // useEffect(() => {
  //   const fetchWalletAndTokenData = async () => {
  //     const address = await getConnectedWalletAddress(); //get wallet address
  //     if (address) {
  //       getPageData(address); //get USD balance

  //       const provider = new ethers.BrowserProvider(
  //         window.ethereum as unknown as ethers.Eip1193Provider
  //       );
  //       const balance = await getTokenBalance(address, tokenAddress, provider); //get token balance
  //       setTokenBalance(balance);
  //     }
  //   };

  //   fetchWalletAndTokenData();
  // }, []);

  useEffect(() => {
    //window.location.reload();
    if (isConnected || !didMount.current) {
      fetchWalletAndTokenData();
    } else {
      //remove user info after disconnect and return to home page
      setWalletAddress(null);
      setTokenBalance(0);
      setUsdBalance(0);
      router.push('/');
    }
    didMount.current = true;
  }, [isConnected]);

  return (
    <nav className="flex justify-between items-center p-4 bg-gray-900 text-white w-full">
      <Link href="/">
        <Image src="/logo.png" alt="RMT Logo" width={40} height={35} />
      </Link>

      {/* Move Navigation Links to the Left */}
      <div className="flex space-x-6 ml-7 font-bold">
        <Link href="/">Home</Link>
        <Link href="/deposit">Deposit</Link>
        <Link href="/convert">Convert</Link>
        <Link href="/sendtoken">Send Token</Link>
        <Link href="/transaction">Transaction</Link>
      </div>

      {/* Right Section - Align Right */}
      <div className="flex items-center space-x-3 ml-auto">
        {isConnected && (
          <div className="bg-gray-800 px-4 py-2 rounded-full shadow-md border border-gray-600 flex space-x-3 items-center">
            <span className="text-yellow-300 font-bold">USD {usdBalance}</span>
            <span className="text-purple-400 font-bold">
              RMT {tokenBalance?.toFixed(2)}
            </span>
          </div>
        )}

        <button
          className="bg-blue-500 text-white px-4 py-2 rounded-full text-sm font-semibold hover:bg-blue-600 transition"
          onClick={handleAdminClick}
        >
          Admin
        </button>

        <Connect />
      </div>
    </nav>
  );
}
