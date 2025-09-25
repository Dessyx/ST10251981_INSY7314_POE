const express = require('express');
const router = express.Router();
const Transactions = require('../models/transaction');

router.get('/', async (req, res) => {
  try {
    const transactions = await transactions.getAll();
    res.json(transactions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const transaction = await Transactions.create(req.body);
    res.json(transaction);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
