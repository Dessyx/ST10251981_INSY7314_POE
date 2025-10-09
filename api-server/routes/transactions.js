const express = require('express');
const router = express.Router();
const Transaction = require('../models/Transaction'); 

// CREATE a new transaction
router.post('/', async (req, res) => {
  try {
    const { amount, recipient, provider, swift_code, payment_date } = req.body;

    // Create transaction
    const transaction = new Transaction({
      amount,
      recipient,
      provider,
      swift_code,
      payment_date
    });

    const savedTransaction = await transaction.save();

    // Convert _id to id for frontend
    const responseTransaction = { 
      ...savedTransaction.toObject(), 
      id: savedTransaction._id 
    };

    res.status(201).json(responseTransaction);
  } catch (err) {
    console.error('Create transaction error:', err);
    res.status(500).json({ message: 'Failed to create transaction', error: err.message });
  }
});

// GET all transactions
router.get('/', async (req, res) => {
  try {
    const transactions = await Transaction.find().sort({ payment_date: -1 });

    // Map each transaction to include `id`
    const responseTransactions = transactions.map(t => ({
      ...t.toObject(),
      id: t._id
    }));

    res.status(200).json(responseTransactions);
  } catch (err) {
    console.error('Get transactions error:', err);
    res.status(500).json({ message: 'Failed to fetch transactions', error: err.message });
  }
});

// GET a single transaction by ID
router.get('/:id', async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);
    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    // Convert _id to id
    const responseTransaction = { 
      ...transaction.toObject(), 
      id: transaction._id 
    };

    res.status(200).json(responseTransaction);
  } catch (err) {
    console.error('Get transaction error:', err);
    res.status(500).json({ message: 'Failed to fetch transaction', error: err.message });
  }
});

module.exports = router;
