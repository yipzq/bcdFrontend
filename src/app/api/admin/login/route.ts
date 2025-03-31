// src/app/api/admin/login/route.ts

import { NextResponse } from 'next/server';
import mysql from 'mysql2/promise';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

const db = mysql.createPool({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
});

export async function POST(req: Request) {
  try {
    const { username, password } = await req.json();

    // Validation
    if (!username || !password) {
      return NextResponse.json(
        { error: 'Username and password are required' },
        { status: 400 }
      );
    }

    // Check if username exists
    const [userRows]: any = await db.query(
      'SELECT * FROM admin WHERE username = ?',
      [username]
    );

    if (userRows.length === 0) {
      // No such username exists
      return NextResponse.json(
        { error: 'Invalid user' },
        { status: 401 }
      );
    }

    // Check if password matches
    const [rows]: any = await db.query(
      'SELECT * FROM admin WHERE username = ? AND password = ?',
      [username, password]
    );

    if (rows.length === 0) {
      // Username exists, but password does not match
      return NextResponse.json(
        { error: 'Username and password do not match' },
        { status: 401 }
      );
    }

    // Create JWT Token
    const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: '1h' });

    // Set HTTP-only cookie
    const response = NextResponse.json({ message: 'Login successful', username });
    response.headers.set(
      'Set-Cookie',
      `token=${token}; HttpOnly; Path=/; Secure`
    );

    return response;
  } catch (error) {
    console.error('Login Error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
