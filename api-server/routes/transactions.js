const express = require('express');
const router = express.Router();
const Transaction = require('../models/transaction');

// GET all transactions
router.get('/', async (req, res) => {
    try {
        const transactions = await Transaction.getAll();
        res.json(transactions);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to fetch transactions" });
    }
});

// POST a new transaction
router.post('/', async (req, res) => {
    const { user_id, amount, currency, description } = req.body;

    // Check required fields
    if (!user_id || !amount || !currency) {
        return res.status(400).json({ error: "Missing required fields: user_id, amount, currency" });
    }

    try {
        const newTransaction = await Transaction.create({
            user_id,
            amount,
            currency,
            description: description || "" // optional
        });
        res.status(201).json(newTransaction);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to create transaction" });
    }
});

module.exports = router;
