import { NextRequest, NextResponse } from 'next/server';
import { ethers } from 'ethers';
import RemittanceToken from '@/abi/RemittanceToken.json';
import { tokenContractAddress } from '@/utils/smartContractAddress';
import { query } from '@/lib/db';

const RPC_URL = process.env.RPC_URL || 'http://127.0.0.1:8545';
const PRIVATE_KEY = process.env.OWNER_PRIVATE_KEY as string;
const CONTRACT_ADDRESS = tokenContractAddress;

export async function POST(request: NextRequest) {
  try {
    const { amount, senderWalletAddress, recipientWalletAddress } =
      await request.json();

    // Validate inputs
    if (!amount || !senderWalletAddress || !recipientWalletAddress) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      );
    }

    if (
      !ethers.isAddress(senderWalletAddress) ||
      !ethers.isAddress(recipientWalletAddress)
    ) {
      return NextResponse.json(
        { error: 'Invalid wallet address format' },
        { status: 400 }
      );
    }

    // Connect to blockchain
    const provider = new ethers.JsonRpcProvider(RPC_URL);
    const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
    const contract = new ethers.Contract(
      CONTRACT_ADDRESS,
      RemittanceToken.abi,
      wallet
    );

    // Calculate fee amount 
    const transferAmount = ethers.parseUnits(amount.toString(), 18);
    const feeAmount = transferAmount * BigInt(1) / BigInt(100); // 1% fee
    const totalAmount = transferAmount + feeAmount;

    // Check if sender has enough tokens for transfer + fee
    const senderBalance = await contract.balanceOf(senderWalletAddress);

    if (senderBalance < totalAmount) {
      return NextResponse.json(
        { error: 'Insufficient token balance including 1 RMT fee' },
        { status: 400 }
      );
    }

    // 1. First transfer the fee to the contract owner
    console.log(
      `Transferring 1 RMT fee from ${senderWalletAddress} to contract owner`
    );
    const ownerAddress = process.env.CONTRACT_OWNER_ADDRESS;
    const feeTx = await contract.transferTokensFromBackend(
      senderWalletAddress,
      ownerAddress,
      feeAmount
    );
    await feeTx.wait();

    // 2. Then transfer the main amount to the recipient
    console.log(
      `Transferring ${amount} RMT from ${senderWalletAddress} to ${recipientWalletAddress}`
    );
    const transferTx = await contract.transferTokensFromBackend(
      senderWalletAddress,
      recipientWalletAddress,
      transferAmount
    );
    await transferTx.wait();

    // Insert transaction record
    await query({
      query:
        'INSERT INTO transaction (initiator, type, amountToken, recipient, status, transactionDateTime) VALUES (?, ?, ?, ?, ?, NOW())',
      values: [
        senderWalletAddress,
        3,
        amount + 1,
        recipientWalletAddress,
        'Completed',
      ],
    });

    return NextResponse.json(
      {
        success: true,
        message: `Successfully sent ${amount} RMT to ${recipientWalletAddress} (fee: 1 RMT)`,
        txHash: transferTx.hash,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Send tokens error:', error);
    return NextResponse.json(
      { error: `Server error: ${error.message}` },
      { status: 500 }
    );
  }
}
