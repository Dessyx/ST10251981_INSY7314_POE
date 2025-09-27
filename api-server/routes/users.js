const express = require('express');
const router = express.Router();
const Joi = require('joi');
const jwt = require('jsonwebtoken');
const userModel = require('../models/user');
const bcrypt = require('bcrypt');

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret';
const PEPPER = process.env.PEPPER || '';

// Registration schema
const registrationSchema = Joi.object({
  full_name: Joi.string().min(2).max(100).required(),
  id_number: Joi.string().min(10).max(20).required(),
  account_number: Joi.string().min(8).max(20).required(),
  username: Joi.string().min(3).max(50).required(),
  password: Joi.string().min(8).max(128).required(),
});


router.post('/register', async (req, res) => {
  const { error, value } = registrationSchema.validate(req.body);
  if (error) return res.status(400).json({ error: 'Invalid input provided' });

  // Check if username already exists
  const existingUsername = await userModel.getUserByUsername(value.username);
  if (existingUsername) return res.status(400).json({ error: 'Invalid input provided' });

  // Check if account number already exists
  const existingAccount = await userModel.getUserByAccountNumber(value.account_number);
  if (existingAccount) return res.status(400).json({ error: 'Invalid input provided' });

  // Check if ID number already exists
  const existingId = await userModel.getUserByIdNumber(value.id_number);
  if (existingId) return res.status(400).json({ error: 'Invalid input provided' });

  const userId = await userModel.createUser(value);
  
  const token = jwt.sign({ id: userId, username: value.username, role: 'customer' }, JWT_SECRET, { expiresIn: '1h' });
  res.status(201).json({ token });
});


const loginSchema = Joi.object({
  username: Joi.string().required(),
  account_number: Joi.string().required(),
  password: Joi.string().min(8).max(128).required(),
});

router.post('/login', async (req, res) => {
  const { error, value } = loginSchema.validate(req.body);
  if (error) return res.status(400).json({ error: 'Invalid input provided' });

  // Find user by username
  const user = await userModel.getUserByUsername(value.username);
  if (!user) return res.status(401).json({ error: 'Invalid credentials' });

  // Verify account number matches
  if (user.account_number !== value.account_number) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  // Verify password
  const valid = await bcrypt.compare(value.password + PEPPER, user.password_hash);
  if (!valid) return res.status(401).json({ error: 'Invalid credentials' });

  const token = jwt.sign({ 
    id: user.id, 
    username: user.username, 
    role: user.role || 'customer' 
  }, JWT_SECRET, { expiresIn: '1h' });
  
  res.json({ token, role: user.role || 'customer' });
});

module.exports = router;
