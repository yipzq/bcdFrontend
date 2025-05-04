// import { NextApiRequest, NextApiResponse } from 'next';
// import { query } from '@/lib/db'; // Assuming you're using a database query function
// import { useWallet } from '@/context/WalletContext';

// export default async function handler(
//   req: NextApiRequest,
//   res: NextApiResponse
// ) {
//   const { walletAddress } = useWallet();
//   // Only handle POST requests
//   if (req.method !== 'POST') {
//     return res.status(405).json({ error: 'Method Not Allowed' });
//   }

//   const { amount } = req.body;

//   // Validate inputs
//   if (!walletAddress || !amount) {
//     return res.status(400).json({ error: 'Missing wallet address or amount' });
//   }

//   try {
//     // Step 1: Check if the wallet address exists in the database
//     const checkSql = 'SELECT * FROM useraccount WHERE walletAddress = ?';
//     const [existingUser] = await query({
//       query: checkSql,
//       values: [walletAddress],
//     });

//     if (existingUser) {
//       // Step 2: Update the balance if the wallet exists
//       const newBalance = existingUser.balance + amount;

//       const updateSql =
//         'UPDATE useraccount SET balance = ? WHERE walletAddress = ?';
//       await query({ query: updateSql, values: [newBalance, walletAddress] });

//       return res
//         .status(200)
//         .json({ success: true, message: 'Balance updated' });
//     } else {
//       // Step 3: Create a new user account if the wallet doesn't exist
//       const insertSql =
//         'INSERT INTO useraccount (walletAddress, balance) VALUES (?, ?)';
//       await query({ query: insertSql, values: [walletAddress, amount] });

//       return res
//         .status(200)
//         .json({ success: true, message: 'User created and balance updated' });
//     }
//   } catch (error) {
//     console.error('Error updating user balance:', error);
//     return res.status(500).json({ error: 'Internal Server Error' });
//   }
// }

import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { ethers } from 'ethers';
import RemittanceToken from '@/abi/RemittanceToken.json';
import { tokenContractAddress } from '@/utils/smartContractAddress';

const RPC_URL = process.env.RPC_URL || 'http://127.0.0.1:8545';
const PRIVATE_KEY = process.env.OWNER_PRIVATE_KEY as string;
const CONTRACT_ADDRESS = tokenContractAddress;

export async function POST(request: NextRequest) {
  try {
    const { amount, walletAddress } = await request.json();

    // Check user balance
    const data = await query({
      query: `SELECT balance FROM useraccount WHERE walletAddress = ?`,
      values: [walletAddress],
    });

    if (data.length === 0) {
      return NextResponse.json({ error: 'Wallet not found' }, { status: 404 });
    }

    const currentBalance = Number(data[0].balance);
    const newBalance = currentBalance - Number(amount);

    if (newBalance < 0) {
      return NextResponse.json(
        { error: 'Insufficient USD balance' },
        { status: 400 }
      );
    }

    // Update USD balance
    await query({
      query: `UPDATE useraccount SET balance = ? WHERE walletAddress = ?`,
      values: [newBalance, walletAddress],
    });

    // Call mintForUser from backend
    const provider = new ethers.JsonRpcProvider(RPC_URL);
    const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
    const contract = new ethers.Contract(
      CONTRACT_ADDRESS,
      RemittanceToken.abi,
      wallet
    );

    console.log(
      'Minting to:',
      walletAddress,
      'Amount (human readable):',
      amount
    );
    const tx = await contract.mintForUser(walletAddress, Number(amount));
    await tx.wait();

    return NextResponse.json(
      { success: true, message: 'Balance updated and tokens minted' },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Internal Error:', error);
    return NextResponse.json(
      { error: `Internal Server Error: ${error.message}` },
      { status: 500 }
    );
  }
}
