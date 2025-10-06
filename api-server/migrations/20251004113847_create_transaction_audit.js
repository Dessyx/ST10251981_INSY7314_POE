// migrations/20251004113847_create_transaction_audit.js

exports.up = function(knex) {
  return knex.schema.createTable('transaction_audit', table => {
    table.increments('id').primary();
    table.integer('transaction_id').notNullable();
    table.integer('user_id').notNullable();
    table.string('action').notNullable();
    table.json('data'); // 
    table.timestamp('created_at').defaultTo(knex.fn.now());
  });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('transaction_audit');
};
