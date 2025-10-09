// api-server/routes/users.js
const express = require('express');
const router = express.Router();
const Joi = require('joi');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { User, getUserByUsername, getUserByAccountNumber, getUserByIdNumber, createUser } = require('../models/user');

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret';
const PEPPER = process.env.PEPPER || '';

// Registration schema
const registrationSchema = Joi.object({
  full_name: Joi.string().min(2).max(100).required(),
  id_number: Joi.string().pattern(/^\d{8,12}$/).required().messages({
    'string.pattern.base': 'ID number must be 8-12 digits'
  }),
  account_number: Joi.string().min(8).max(20).required(),
  username: Joi.string().min(3).max(50).required(),
  password: Joi.string().min(8).max(128).required(),
});

// Login schema
const loginSchema = Joi.object({
  username: Joi.string().required(),
  account_number: Joi.string().required(),
  password: Joi.string().min(8).max(128).required(),
});

// REGISTER endpoint
router.post('/register', async (req, res) => {
  try {
    const { error, value } = registrationSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    if (await getUserByUsername(value.username))
      return res.status(400).json({ error: 'Username already exists' });

    if (await getUserByAccountNumber(value.account_number))
      return res.status(400).json({ error: 'Account number already exists' });

    if (await getUserByIdNumber(value.id_number))
      return res.status(400).json({ error: 'ID number already exists' });

    const userId = await createUser(value);

    const token = jwt.sign({ id: userId, username: value.username, role: 'customer' }, JWT_SECRET, { expiresIn: '1h' });

    res.cookie('authToken', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: 3600000,
      path: '/',
      domain: 'localhost'
    });

    res.status(201).json({
      success: true,
      message: 'Registration successful',
      user: { id: userId, username: value.username, role: 'customer' }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// LOGIN endpoint
router.post('/login', async (req, res) => {
  try {
    const { error, value } = loginSchema.validate(req.body);
    if (error) return res.status(400).json({ error: 'Invalid input provided' });

    const user = await getUserByUsername(value.username);
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });
    if (user.account_number !== value.account_number) return res.status(401).json({ error: 'Invalid credentials' });

    const valid = await bcrypt.compare(value.password + PEPPER, user.password_hash);
    if (!valid) return res.status(401).json({ error: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id, username: user.username, role: user.role || 'customer' }, JWT_SECRET, { expiresIn: '1h' });

    res.cookie('authToken', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: 3600000,
      path: '/',
      domain: 'localhost'
    });

    res.json({
      success: true,
      message: 'Login successful',
      user: { role: user.role || 'customer', userId: user._id, username: user.username, fullName: user.full_name }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// LOGOUT endpoint
router.post('/logout', (req, res) => {
  res.clearCookie('authToken', { httpOnly: true, secure: true, sameSite: 'strict', path: '/', domain: 'localhost' });
  res.json({ success: true, message: 'Logged out successfully' });
});

// VERIFY authentication
router.get('/verify', (req, res) => {
  try {
    const token = req.cookies.authToken;
    if (!token) return res.json({ authenticated: false });

    const decoded = jwt.verify(token, JWT_SECRET);
    res.json({ authenticated: true, user: { id: decoded.id, username: decoded.username, role: decoded.role || 'customer' } });
  } catch {
    res.json({ authenticated: false });
  }
});

module.exports = router;
