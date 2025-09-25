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
  name: Joi.string().min(2).max(50).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).max(128).required(),
});


router.post('/register', async (req, res) => {
  const { error, value } = registrationSchema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  const existing = await userModel.getUserByEmail(value.email);
  if (existing) return res.status(409).json({ error: 'Email already registered' });

  const userId = await userModel.createUser(value);
  
  const token = jwt.sign({ id: userId, email: value.email }, JWT_SECRET, { expiresIn: '1h' });
  res.status(201).json({ token });
});


const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).max(128).required(),
});

router.post('/login', async (req, res) => {
  const { error, value } = loginSchema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  const user = await userModel.getUserByEmail(value.email);
  if (!user) return res.status(401).json({ error: 'Invalid credentials' });

  const valid = await bcrypt.compare(value.password + PEPPER, user.password_hash);
  if (!valid) return res.status(401).json({ error: 'Invalid credentials' });

  
  const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '1h' });
  res.json({ token });
});

module.exports = router;
