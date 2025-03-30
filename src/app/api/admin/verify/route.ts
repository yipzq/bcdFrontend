// src/app/api/admin/verify/route.ts
import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

export async function POST(req: Request) {
  // Get cookies from the request
  const cookieHeader = req.headers.get('cookie');
  const token = cookieHeader?.split('; ').find(c => c.startsWith('token='))?.split('=')[1];

  // Check if token exists
  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token, JWT_SECRET);
    return NextResponse.json({ message: 'Authenticated', username: (decoded as any).username });
  } catch {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
  }
}
