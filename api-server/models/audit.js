const mongoose = require('../database');

const auditLogSchema = new mongoose.Schema({
  action: { type: String, required: true },
  entity: { type: String, required: true },
  entity_id: { type: String },
  user_id: { type: String },
  before: { type: mongoose.Schema.Types.Mixed },
  after: { type: mongoose.Schema.Types.Mixed },
  ip: { type: String },
  user_agent: { type: String },
  created_at: { type: Date, default: Date.now }
});

const AuditLog = mongoose.model('AuditLog', auditLogSchema);

const Audit = {
  log: async ({ action, entity, entity_id, user_id, before, after, ip, user_agent }) => {
    const auditLog = new AuditLog({
      action,
      entity,
      entity_id,
      user_id,
      before,
      after,
      ip,
      user_agent
    });
    await auditLog.save();
  }
};

module.exports = Audit;
