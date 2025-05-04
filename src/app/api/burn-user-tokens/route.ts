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

    if (!walletAddress || !amount) {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }

    const provider = new ethers.JsonRpcProvider(RPC_URL);
    const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
    const contract = new ethers.Contract(
      CONTRACT_ADDRESS,
      RemittanceToken.abi,
      wallet
    );

    // Burn tokens (backend is the owner)
    const parsedAmount = ethers.parseUnits(amount.toString(), 18);
    const tx = await contract.burnTokensForUSD(walletAddress, parsedAmount);
    await tx.wait();

    // Add USD balance after burning
    const data = await query({
      query: `SELECT balance FROM useraccount WHERE walletAddress = ?`,
      values: [walletAddress],
    });

    if (data.length === 0) {
      return NextResponse.json({ error: 'Wallet not found' }, { status: 404 });
    }

    const currentBalance = Number(data[0].balance);
    const newBalance = currentBalance + Number(amount);

    await query({
      query: `UPDATE useraccount SET balance = ? WHERE walletAddress = ?`,
      values: [newBalance, walletAddress],
    });

    return NextResponse.json(
      { success: true, message: 'Tokens burned and USD credited' },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Burn error:', error);
    return NextResponse.json(
      { error: error.message || 'Token burn failed' },
      { status: 500 }
    );
  }
}
