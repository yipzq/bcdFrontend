'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

type WalletContextType = {
  walletAddress: string | null;
  setWalletAddress: (address: string | null) => void;
  usdBalance: number;
  setUsdBalance: (balance: number) => void;
  tokenBalance: number;
  setTokenBalance: (balance: number) => void;
};

const WalletContext = createContext<WalletContextType>({
  walletAddress: null,
  setWalletAddress: () => {},
  usdBalance: 0,
  setUsdBalance: () => {},
  tokenBalance: 0,
  setTokenBalance: () => {},
});

export const WalletProvider = ({ children }: { children: ReactNode }) => {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [usdBalance, setUsdBalance] = useState<number>(0);
  const [tokenBalance, setTokenBalance] = useState<number>(0);

  return (
    <WalletContext.Provider
      value={{
        walletAddress,
        setWalletAddress,
        usdBalance,
        setUsdBalance,
        tokenBalance,
        setTokenBalance,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => useContext(WalletContext);
