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

export async function POST(request: NextRequest) {
  try {
    const { amount, walletAddress } = await request.json();

    const querySql = `SELECT balance FROM useraccount WHERE walletAddress = ?`;
    const data = await query({
      query: querySql,
      values: [walletAddress],
    });

    const balance = data.length > 0 ? data[0].balance : null;
    const newBalance = Number(balance) - Number(amount);

    const updateSql = `UPDATE useraccount SET balance = ? WHERE walletAddress = ?`;
    await query({
      query: updateSql,
      values: [newBalance, walletAddress],
    });

    return NextResponse.json(
      { success: true, message: 'Balance updated' },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error('Internal Error:', error);
    // Handle other errors (e.g., network issues, parsing errors)
    return NextResponse.json(
      { error: `Internal Server Error: ${error}` },
      { status: 500 }
    );
  }
}
