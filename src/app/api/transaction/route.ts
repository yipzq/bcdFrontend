// /src/app/api/transaction-history/route.ts
import { query } from '@/lib/db'; // Update path as needed

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const walletAddress = searchParams.get('walletAddress');

  if (!walletAddress) {
    return new Response(JSON.stringify({ error: 'Missing wallet address' }), {
      status: 400,
    });
  }

  const sql = `
  SELECT 
    t.transactionID,
    t.amountUSD,
    t.amountToken,
    t.reference,
    t.status,
    t.transactionDateTime,
    tt.description AS transactionType,
    t.initiator,
    t.recipient,
    CASE 
        WHEN t.initiator = ? AND tt.description = 'Transfer' THEN 'outgoing'
        WHEN t.recipient = ? AND tt.description = 'Transfer' THEN 'incoming'
        ELSE 'other'
    END AS direction
  FROM transaction t
  JOIN transactiontype tt ON t.type = tt.typeID
  WHERE t.initiator = ? OR t.recipient = ?
  ORDER BY t.transactionDateTime DESC;
`;

  const data = await query({
    query: sql,
    values: [walletAddress, walletAddress, walletAddress, walletAddress],
  });

  return new Response(JSON.stringify(data), { status: 200 });
}
