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

    // Insert transaction record
    await query({
      query:
        'INSERT INTO transaction (initiator, type, amountUSD, amountToken, status, transactionDateTime) VALUES (?, ?, ?, ?, ?, NOW())',
      values: [walletAddress, 2, amount, amount, 'Completed'],
    });

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
