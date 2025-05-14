const bcrypt = require('bcrypt');
const poolPromise = require('./db'); // Import the promise

async function hashPlaintextPasswords() {
  const pool = await poolPromise; // Wait for the actual pool object

  // 1. Get users with plaintext passwords
  const [users] = await pool.query(
    'SELECT user_id, password FROM users WHERE password_hash IS NULL OR password_hash = ""'
  );

  // 2. Loop through each user
  for (const user of users) {
    const { user_id, password } = user;

    // 3. Hash the plain text password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // 4. Update the user's record with the hashed password
    await pool.query(
      'UPDATE users SET password_hash = ? WHERE user_id = ?',
      [hashedPassword, user_id]
    );

    console.log(`Hashed password for user ID: ${user_id}`);
  }
}

hashPlaintextPasswords().catch(console.error);
