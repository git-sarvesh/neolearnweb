const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
  try {
    const { username, emailID, password } = req.body;

    // Validation
    if (!username || !emailID || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    // Check if user already exists
    const [existingUsers] = await db.execute(
      'SELECT * FROM users WHERE emailID = ?',
      [emailID]
    );

    if (existingUsers.length > 0) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    // Hash password
    const hashed = await bcrypt.hash(password, 10);

    // Insert user
    await db.execute(
      'INSERT INTO users (username, emailID, password) VALUES (?, ?, ?)',
      [username, emailID, hashed]
    );

    res.status(201).json({ message: 'Registration successful! Please log in.' });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ message: 'Registration failed', error: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { emailID, password } = req.body;

    // Validation
    if (!emailID || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Find user
    const [rows] = await db.execute('SELECT * FROM users WHERE emailID = ?', [emailID]);

    if (rows.length === 0) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const user = rows[0];

    // Check password
    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Generate token
    const token = jwt.sign(
      { id: user.id, emailID: user.emailID },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        emailID: user.emailID
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Login failed', error: err.message });
  }
};
