// src/utils/smartContractAddress.ts

if (!process.env.NEXT_PUBLIC_TOKEN_CONTRACT_ADDRESS) {
    throw new Error('NEXT_PUBLIC_TOKEN_CONTRACT_ADDRESS is not defined');
  }
  
  export const tokenContractAddress: string = process.env.NEXT_PUBLIC_TOKEN_CONTRACT_ADDRESS;
  