// src/app/api/admin/logout/route.ts
import { NextResponse } from 'next/server';

export async function POST() {
  // Clear the JWT token by setting an expired cookie
  const response = NextResponse.json({ message: 'Logout successful' });
  response.headers.set('Set-Cookie', `token=; HttpOnly; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT`);
  return response;
}

