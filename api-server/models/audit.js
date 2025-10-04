const db = require('../database');

const Audit = {
  log: async ({ action, entity, entity_id, user_id, before, after, ip, user_agent }) => {
    await db('audit_logs').insert({
      action, entity, entity_id, user_id,
      before: before ? JSON.stringify(before) : null,
      after: after ? JSON.stringify(after) : null,
      ip, user_agent,
      created_at: db.fn.now()
    });
  }
};

module.exports = Audit;
