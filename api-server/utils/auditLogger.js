const mongoose = require('../database'); 

const transactionAuditSchema = new mongoose.Schema({
  transaction_id: { type: Number, required: true },
  user_id: { type: Number, required: true },
  action: { type: String, required: true },
  data: { type: Object, default: {} },
  created_at: { type: Date, default: Date.now },
});

const TransactionAudit = mongoose.model('TransactionAudit', transactionAuditSchema);

async function logTransactionAction(transaction_id, user_id, action, data = {}) {
  try {
    await TransactionAudit.create({ transaction_id, user_id, action, data });
    console.log(`Audit logged for transaction ${transaction_id}, action: ${action}`);
  } catch (err) {
    console.error('Failed to log transaction audit:', err);
  }
}

module.exports = { logTransactionAction };
