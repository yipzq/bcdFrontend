// src/app/api/admin/login/route.ts

// import { NextResponse } from 'next/server';
// import mysql from 'mysql2/promise';
// import jwt from 'jsonwebtoken';

// const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

// const db = mysql.createPool({
//   host: process.env.DATABASE_HOST,
//   user: process.env.DATABASE_USER,
//   password: process.env.DATABASE_PASSWORD,
//   database: process.env.DATABASE_NAME,
// });

// export async function POST(req: Request) {
//   try {
//     const { username, password } = await req.json();

//     // Validation
//     if (!username || !password) {
//       return NextResponse.json(
//         { error: 'Username and password are required' },
//         { status: 400 }
//       );
//     }

//     // Check if username exists
//     const [userRows]: any = await db.query(
//       'SELECT * FROM admin WHERE username = ?',
//       [username]
//     );

//     if (userRows.length === 0) {
//       // No such username exists
//       return NextResponse.json(
//         { error: 'Invalid user' },
//         { status: 401 }
//       );
//     }

//     // Check if password matches
//     const [rows]: any = await db.query(
//       'SELECT * FROM admin WHERE username = ? AND password = ?',
//       [username, password]
//     );

//     if (rows.length === 0) {
//       // Username exists, but password does not match
//       return NextResponse.json(
//         { error: 'Username and password do not match' },
//         { status: 401 }
//       );
//     }

//     // Create JWT Token
//     const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: '1h' });

//     // Set HTTP-only cookie
//     const response = NextResponse.json({ message: 'Login successful', username });
//     response.headers.set(
//       'Set-Cookie',
//       `token=${token}; HttpOnly; Path=/; Secure`
//     );

//     return response;
//   } catch (error) {
//     console.error('Login Error:', error);
//     return NextResponse.json(
//       { error: 'Internal Server Error' },
//       { status: 500 }
//     );
//   }
// }

//src/app/api/admin/login/route.ts

import { NextResponse } from 'next/server';
import mysql from 'mysql2/promise';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

// JWT Secret
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

// MySQL Connection
const db = mysql.createPool({
  host: process.env.DATABASE_HOST || 'localhost',
  user: process.env.DATABASE_USER || 'root',
  password: process.env.DATABASE_PASSWORD || '',
  database: process.env.DATABASE_NAME || 'bcd',
});

export async function POST(req: Request) {
  try {
    const { username, password } = await req.json();

    if (!username || !password) {
      return NextResponse.json(
        { error: 'Username and password are required' },
        { status: 400 }
      );
    }

    // Fetch the user from the database
    const [rows]: any = await db.query(
      'SELECT * FROM admin WHERE username = ?',
      [username]
    );

    if (rows.length === 0) {
      return NextResponse.json(
        { error: 'Invalid username or password' },  // Generic message for security
        { status: 401 }
      );
    }

    const user = rows[0];
    const hashedPassword = user.password;

    // Compare the plain password with the hashed password
    const isMatch = await bcrypt.compare(password, hashedPassword);

    if (!isMatch) {
      return NextResponse.json(
        { error: 'Invalid username or password' },
        { status: 401 }
      );
    }

    // Create JWT Token
    const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: '1h' });

    // Determine environment
    const isProduction = process.env.NODE_ENV === 'production';

    // Set HTTP-only cookie
    const response = NextResponse.json({ message: 'Login successful', username });
    response.headers.set(
      'Set-Cookie',
      `token=${token}; HttpOnly; Path=/; ${isProduction ? 'Secure;' : ''} SameSite=Strict; Max-Age=3600`
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

