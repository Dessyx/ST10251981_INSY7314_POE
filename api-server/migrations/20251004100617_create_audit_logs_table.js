// migrations/20251004104523_create_audit_logs_table.js

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('audit_logs', table => {
    table.increments('id').primary();
    table.integer('user_id').unsigned().notNullable();
    table.string('action', 255).notNullable();
    table.json('data').nullable();
    table.string('ip_address', 45).nullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTableIfExists('audit_logs');
};
