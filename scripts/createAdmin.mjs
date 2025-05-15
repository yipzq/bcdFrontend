// src/scripts/createAdmin.mjs
import readline from 'readline';
import mysql from 'mysql2/promise';
import bcrypt from 'bcrypt';

// Create readline interface
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Helper function to get input
const getInput = (prompt) => {
  return new Promise((resolve) => {
    rl.question(prompt, (answer) => {
      resolve(answer);
    });
  });
};

async function createAdmin() {
  try {
    // Database connection
    const connection = await mysql.createConnection({
      host: process.env.DATABASE_HOST || 'localhost',
      user: process.env.DATABASE_USER || 'root',
      password: process.env.DATABASE_PASSWORD || '',
      database: process.env.DATABASE_NAME || 'bcd',
    });

    let username;
    while (true) {
      username = await getInput('Enter username: ');
      if (!username) {
        console.log('Username is required.');
        continue;
      }

      const [rows] = await connection.query('SELECT adminID FROM admin WHERE username = ?', [username]);
      if (rows.length > 0) {
        console.log('Username already exists. Please choose a different username.');
      } else {
        break; 
      }
    }

    let password;
    while (true) {
      password = await getInput('Enter password: ');
      if (password.length >= 8) break;
      console.log('Password must be at least 8 characters long. Please try again.');
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert new admin
    await connection.query(
      'INSERT INTO admin (username, password) VALUES (?, ?)',
      [username, hashedPassword]
    );

    console.log(`Admin user "${username}" created successfully!`);

    await connection.end();
    rl.close();
  } catch (err) {
    console.error('Error creating admin:', err.message);
    rl.close();
  }
}

// Run the script
createAdmin();
