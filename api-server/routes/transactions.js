const express = require('express');
const router = express.Router();
const Transaction = require('../models/transaction'); 

// GET all transactions
router.get('/', async (req, res) => {
  try {
    const transactions = await Transaction.getAll();
    res.json(transactions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
