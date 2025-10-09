const express = require('express');
const router = express.Router();
const Transaction = require('../models/Transaction'); 

// CREATE a new transaction
router.post('/', async (req, res) => {
  try {
    const { 
      amount, 
      currency, 
      recipient, 
      recipient_name,
      provider, 
      swift_code, 
      description,
      user_id,
      user_full_name,
      payment_date 
    } = req.body;

    // Create transaction
    const transaction = new Transaction({
      amount,
      currency: currency || 'ZAR',
      recipient: recipient || recipient_name,
      recipient_name: recipient_name || recipient,
      provider,
      swift_code,
      description: description || '',
      status: 'pending',
      user_id,
      user_full_name,
      payment_date: payment_date || new Date()
    });

    const savedTransaction = await transaction.save();


    const responseTransaction = { 
      ...savedTransaction.toObject(), 
      id: savedTransaction._id,
      transaction_number: savedTransaction.transaction_number
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

    const responseTransactions = transactions.map(t => ({
      ...t.toObject(),
      id: t._id,
      transaction_number: t.transaction_number
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

    const responseTransaction = { 
      ...transaction.toObject(), 
      id: transaction._id,
      transaction_number: transaction.transaction_number
    };

    res.status(200).json(responseTransaction);
  } catch (err) {
    console.error('Get transaction error:', err);
    res.status(500).json({ message: 'Failed to fetch transaction', error: err.message });
  }
});

// UPDATE transaction status (PATCH)
router.patch('/:id', async (req, res) => {
  try {
    const { status } = req.body;
    
    // Validate status
    const validStatuses = ['pending', 'verified', 'completed', 'failed'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }

    const transaction = await Transaction.findByIdAndUpdate(
      req.params.id,
      { status, updated_at: Date.now() },
      { new: true, runValidators: true }
    );

    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    const responseTransaction = { 
      ...transaction.toObject(), 
      id: transaction._id,
      transaction_number: transaction.transaction_number
    };

    res.status(200).json(responseTransaction);
  } catch (err) {
    console.error('Update transaction error:', err);
    res.status(500).json({ message: 'Failed to update transaction', error: err.message });
  }
});

module.exports = router;
