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
    // Get username and password using readline
    const username = await getInput('Enter username: ');
    const password = await getInput('Enter password: ');

    if (!username || !password) {
      console.log('Username and password are required.');
      rl.close();
      return;
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Database connection
    const connection = await mysql.createConnection({
      host: process.env.DATABASE_HOST || 'localhost',  // Fallback to localhost if not set
      user: process.env.DATABASE_USER || 'root',  // Fallback to 'root' if not set
      password: process.env.DATABASE_PASSWORD || '', // Fallback to empty password if not set
      database: process.env.DATABASE_NAME || 'bcd',  // Fallback to 'bcd' if not set
    });

    // Insert into the database
    await connection.query('INSERT INTO admin (username, password) VALUES (?, ?)', [username, hashedPassword]);
    console.log(`Admin user ${username} created successfully!`);

    // Close the database connection and readline
    await connection.end();
    rl.close();
  } catch (err) {
    console.error('Error creating admin:', err.message);
    rl.close();
  }
}

// Run the create admin function
createAdmin();
