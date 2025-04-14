const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const sendEmail = require('../utils/sendEmail');
const router = express.Router();

const users = []; // mock database
const jwtSecret = 'your_jwt_secret';
const frontendURL = 'http://localhost:5173';

router.post('/register', async (req, res) => {
  const { email, password } = req.body;
  const hashed = await bcrypt.hash(password, 10);
  const user = { email, password: hashed, verified: false };
  users.push(user);

  const token = jwt.sign({ email }, jwtSecret, { expiresIn: '1h' });
  const url = `${frontendURL}/verify-email?token=${token}`;

  await sendEmail(email, 'Verify your email', `<a href="${url}">Click here to verify your email</a>`);
  res.json({ message: 'Verification email sent' });
});

router.get('/verify-email', (req, res) => {
  try {
    const { token } = req.query;
    const { email } = jwt.verify(token, jwtSecret);
    const user = users.find(u => u.email === email);
    if (user) user.verified = true;
    res.send('Email verified successfully!');
  } catch {
    res.status(400).send('Invalid or expired token.');
  }
});

module.exports = router;
