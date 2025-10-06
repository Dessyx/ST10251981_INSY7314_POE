// utils/Logger.js
const db = require('../database');

async function logTransactionAction(transaction_id, user_id, action, data = {}) {
  try {
    await db('transaction_audit').insert({
      transaction_id,
      user_id,
      action,
      data: JSON.stringify(data),
      created_at: db.fn.now()
    });
  } catch (err) {
    console.error('Failed to log transaction audit:', err);
  }
}

module.exports = { logTransactionAction };
