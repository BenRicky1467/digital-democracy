const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const { registerUser, loginUser } = require('./auth');
const db = require('./db');
const { registerAndEnrollUser } = require('./registerUser');  // <--  Fabric helper function

dotenv.config();

// JWT Middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Access token required' });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: 'Invalid token' });
    req.user = user;
    next();
  });
};

// Admin Role Middleware
const isAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied: Admins only' });
  }
  next();
};

// Register
router.post('/register', async (req, res) => {
  const { username, email, password, faculty, role } = req.body;
  if (!username || !email || !password || !faculty) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const newUser = await registerUser(username, email, password, faculty, role);
    res.status(201).json({ message: '✅ User registered', user: newUser });
  } catch (err) {
    res.status(500).json({ message: '❌ Registration failed', error: err.message });
  }
});


// Fabric CA user registration route
router.post('/fabric-register', authenticateToken, async (req, res) => {
  const { username } = req.body;

  if (!username) {
    return res.status(400).json({ message: 'Username is required' });
  }

  try {
    // Call the Fabric function to register & enroll the user
    await registerAndEnrollUser(username);

    res.status(200).json({ message: `User ${username} registered on Fabric CA successfully.` });
  } catch (error) {
    console.error('Fabric registration error:', error);
    res.status(500).json({ message: 'Fabric user registration failed', error: error.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
    const user = await loginUser(email, password);
    if (!user) return res.status(401).json({ message: 'Invalid email or password' });

    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        faculty: user.faculty,
        role: user.role
      },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(200).json({ message: '✅ Login successful', token, user });
  } catch (err) {
    res.status(500).json({ message: '❌ Login failed', error: err.message });
  }
});

// Create Election (Admin only)
router.post('/elections', authenticateToken, isAdmin, async (req, res) => {
  const { title, description, electionDate, faculty } = req.body;
  if (!title || !electionDate || !faculty) {
    return res.status(400).json({ message: 'Title, election date, and faculty are required' });
  }

  try {
    const [result] = await db.query(
      'INSERT INTO elections (title, description, election_date, faculty) VALUES (?, ?, ?, ?)',
      [title, description, electionDate, faculty]
    );
    res.status(201).json({ message: '🗳️ Election created', electionId: result.insertId });
  } catch (err) {
    res.status(500).json({ message: '❌ Failed to create election', error: err.message });
  }
});

// Add candidate (Admin only)
router.post('/candidates', authenticateToken, isAdmin, async (req, res) => {
  const { name, electionId, faculty } = req.body;
  if (!name || !electionId || !faculty) {
    return res.status(400).json({ message: 'Candidate name, election ID, and faculty are required' });
  }

  try {
    const [electionRows] = await db.query('SELECT * FROM elections WHERE id = ?', [electionId]);
    if (electionRows.length === 0) {
      return res.status(404).json({ message: 'Election not found' });
    }

    const [result] = await db.query(
      'INSERT INTO candidates (name, election_id, faculty) VALUES (?, ?, ?)',
      [name, electionId, faculty]
    );

    res.status(201).json({ message: '🧑‍💼 Candidate added', candidateId: result.insertId });
  } catch (err) {
    res.status(500).json({ message: '❌ Failed to add candidate', error: err.message });
  }
});

// List Elections
router.get('/elections', authenticateToken, async (req, res) => {
  try {
    const [elections] = await db.query('SELECT * FROM elections');
    res.status(200).json({ elections });
  } catch (err) {
    res.status(500).json({ message: '❌ Failed to fetch elections', error: err.message });
  }
});

// List Candidates
router.get('/elections/:electionId/candidates', authenticateToken, async (req, res) => {

  const { electionId } = req.params;
  try {
    const [candidates] = await db.query(
      'SELECT * FROM candidates WHERE election_id = ?',
      [electionId]
    );
    res.status(200).json({ candidates });
  } catch (err) {
    res.status(500).json({ message: '❌ Failed to fetch candidates', error: err.message });
  }
});

// Vote
router.post('/vote', authenticateToken, async (req, res) => {
  console.log('🔔 /vote route hit with body:', req.body);

  const { electionId, candidateId } = req.body;

  if (!electionId || !candidateId) {
    return res.status(400).json({ message: 'Election ID and candidate ID are required' });
  }

  try {
    console.log('📥 Fetching election with ID:', electionId);
    const [electionRows] = await db.query('SELECT * FROM elections WHERE id = ?', [electionId]);

    const election = electionRows[0];
    if (!election) {
      console.log('❌ No election found for ID:', electionId);
      return res.status(404).json({ message: 'Election not found' });
    }

    console.log('📅 Validating election date...');
    const today = new Date().toISOString().split('T')[0];
    const electionDate = new Date(election.election_date).toISOString().split('T')[0];
    if (electionDate < today) {
      console.log('⛔ Election expired:', electionDate);
      return res.status(400).json({ message: 'Election is closed or expired' });
    }

    console.log('🏫 Validating faculty access...');
    if (election.faculty !== 'ALL' && election.faculty !== req.user.faculty) {
      console.log(`⛔ User faculty (${req.user.faculty}) does not match election faculty (${election.faculty})`);
      return res.status(403).json({ message: 'You are not eligible to vote in this election' });
    }

    console.log('🔍 Checking for existing vote...');
    const [existingVote] = await db.query(
      'SELECT * FROM votes WHERE user_id = ? AND election_id = ?',
      [req.user.userId, electionId]
    );
    if (existingVote.length > 0) {
      console.log('⛔ User already voted:', existingVote);
      return res.status(400).json({ message: 'You have already voted in this election' });
    }

    console.log('🗳️ Recording vote...');
    await db.query(
      'INSERT INTO votes (user_id, candidate_id, election_id) VALUES (?, ?, ?)',
      [req.user.userId, candidateId, electionId]
    );

    console.log('✅ Vote successfully recorded!');
    res.status(200).json({ message: '🗳️ Vote recorded successfully' });
  } catch (err) {
    console.error('❌ Vote error:', err);
    res.status(500).json({ message: '❌ Vote failed', error: err.message });
  }
});


// 🆕 Updated Results Route: Grouped by election & candidate with camelCase response + Debug Logs
router.get('/elections/:electionId/results', authenticateToken, async (req, res) => {
  const { electionId } = req.params;
  console.log(`📥 [RESULTS ROUTE] Request received for electionId: ${electionId}`);

  try {
    // Optional: Check if the election exists
    const [electionCheck] = await db.query('SELECT * FROM elections WHERE id = ?', [electionId]);
    if (electionCheck.length === 0) {
      console.warn(`⚠️ Election with ID ${electionId} not found.`);
      return res.status(404).json({ message: 'Election not found.' });
    }
    console.log(`✅ Election found: ${electionCheck[0].title}`);

    // Fetch results
    const [results] = await db.query(
      `SELECT 
         c.id AS candidateId,
         c.name AS candidateName,
         COUNT(v.id) AS voteCount
       FROM candidates c
       LEFT JOIN votes v ON c.id = v.candidate_id
       WHERE c.election_id = ?
       GROUP BY c.id, c.name
       ORDER BY voteCount DESC`,
      [electionId]
    );

    console.log(`📊 Vote results for election ${electionId}:`, results);

    res.status(200).json({ electionId, results });
  } catch (err) {
    console.error('❌ Error tallying results:', err);
    res.status(500).json({ message: '❌ Failed to tally results', error: err.message });
  }
});



// Delete Election
router.delete('/elections/:id', authenticateToken, isAdmin, async (req, res) => {
  const electionId = req.params.id;
  try {
    await db.query(`DELETE v FROM votes v JOIN candidates c ON v.candidate_id = c.id WHERE c.election_id = ?`, [electionId]);
    await db.query('DELETE FROM candidates WHERE election_id = ?', [electionId]);
    const [result] = await db.query('DELETE FROM elections WHERE id = ?', [electionId]);

    if (result.affectedRows > 0) {
      return res.json({ message: '🗑️ Election deleted successfully' });
    } else {
      return res.status(404).json({ message: 'Election not found' });
    }
  } catch (err) {
    res.status(500).json({ message: '❌ Failed to delete election', error: err.message });
  }
});

// Delete Candidate
router.delete('/candidates/:id', authenticateToken, isAdmin, async (req, res) => {
  const candidateId = req.params.id;
  try {
    await db.query('DELETE FROM votes WHERE candidate_id = ?', [candidateId]);
    const [result] = await db.query('DELETE FROM candidates WHERE id = ?', [candidateId]);

    if (result.affectedRows > 0) {
      return res.json({ message: '🗑️ Candidate deleted successfully' });
    } else {
      return res.status(404).json({ message: 'Candidate not found' });
    }
  } catch (err) {
    res.status(500).json({ message: '❌ Failed to delete candidate', error: err.message });
  }
});

module.exports = router;
