const express = require('express');
const router = express.Router();
const { body, validationResult, param } = require('express-validator');
const Transaction = require('../models/transaction');
const { paymentLimiter } = require('../middleware/security');

// Input validation middleware
const validateTransaction = [
  body('amount').isFloat({ min: 0.01 }).withMessage('Amount must be a positive number'),
  body('currency').isIn(['ZAR', 'USD', 'EUR', 'GBP']).withMessage('Invalid currency'),
  body('recipient').isLength({ min: 2, max: 100 }).withMessage('Recipient name must be 2-100 characters'),
  body('provider').isLength({ min: 2, max: 100 }).withMessage('Provider name must be 2-100 characters'),
  body('swift_code').matches(/^[A-Z]{4}[A-Z]{2}[A-Z0-9]{2}([A-Z0-9]{3})?$/).withMessage('Invalid SWIFT code format'),
  body('user_id').isInt({ min: 1 }).withMessage('Valid user ID is required')
];

// GET all transactions
router.get('/', async (req, res) => {
    try {
        const { user_id, status, limit = 50, offset = 0 } = req.query;
        
        let transactions = await Transaction.getAllWithUsers();
        
        // Filter by user if specified
        if (user_id) {
            transactions = transactions.filter(t => t.user_id == user_id);
        }
        
        // Filter by status if specified
        if (status) {
            transactions = transactions.filter(t => t.status === status);
        }
        
        // Apply pagination
        const startIndex = parseInt(offset);
        const endIndex = startIndex + parseInt(limit);
        const paginatedTransactions = transactions.slice(startIndex, endIndex);
        
        res.json({
            transactions: paginatedTransactions,
            total: transactions.length,
            limit: parseInt(limit),
            offset: parseInt(offset)
        });
    } catch (err) {
        console.error('Get transactions error:', err);
        res.status(500).json({ error: "Failed to fetch transactions" });
    }
});

// GET a specific transaction by ID
router.get('/:id', [
    param('id').isInt({ min: 1 }).withMessage('Invalid transaction ID')
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const transaction = await Transaction.getById(req.params.id);
        if (!transaction) {
            return res.status(404).json({ error: "Transaction not found" });
        }
        
        res.json(transaction);
    } catch (err) {
        console.error('Get transaction error:', err);
        res.status(500).json({ error: "Failed to fetch transaction" });
    }
});

// POST a new transaction
router.post('/', paymentLimiter, validateTransaction, async (req, res) => {
    try {
        // Check validation results
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { user_id, amount, currency, recipient, provider, swift_code, description } = req.body;

        // Additional server-side validation
        if (amount <= 0) {
            return res.status(400).json({ error: "Amount must be greater than 0" });
        }

        // Sanitize input data
        const sanitizedData = {
            user_id: parseInt(user_id),
            amount: parseFloat(amount),
            currency: currency.toUpperCase(),
            recipient_name: recipient.trim(),
            provider: provider.trim(),
            swift_code: swift_code.toUpperCase(),
            description: description ? description.trim() : '',
            status: 'pending' // Default status
        };

        const newTransaction = await Transaction.create(sanitizedData);
        
        // Log transaction creation for audit
        console.log(`Transaction created: ID ${newTransaction.id}, Amount: ${newTransaction.currency} ${newTransaction.amount}, User: ${newTransaction.user_id}`);
        
        res.status(201).json({
            ...newTransaction,
            transactionId: `TXN${newTransaction.id.toString().padStart(6, '0')}`, // Generate readable transaction ID
            timestamp: newTransaction.created_at
        });
    } catch (err) {
        console.error('Create transaction error:', err);
        res.status(500).json({ error: "Failed to create transaction" });
    }
});

// PATCH update transaction status
router.patch('/:id', [
    param('id').isInt({ min: 1 }).withMessage('Invalid transaction ID'),
    body('status').isIn(['pending', 'verified', 'completed', 'failed', 'cancelled']).withMessage('Invalid status')
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { status } = req.body;
        const updatedTransaction = await Transaction.updateStatus(req.params.id, status);
        
        if (!updatedTransaction) {
            return res.status(404).json({ error: "Transaction not found" });
        }

        console.log(`Transaction ${req.params.id} status updated to: ${status}`);
        res.json(updatedTransaction);
    } catch (err) {
        console.error('Update transaction error:', err);
        res.status(500).json({ error: "Failed to update transaction" });
    }
});

module.exports = router;
