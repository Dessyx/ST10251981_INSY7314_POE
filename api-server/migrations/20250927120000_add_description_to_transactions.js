// migrations/20250927120000_add_description_to_transactions.js
exports.up = function(knex) {
  return knex.schema.alterTable('transactions', table => {
    table.string('description').defaultTo('');
  });
};

exports.down = function(knex) {
  return knex.schema.alterTable('transactions', table => {
    table.dropColumn('description');
  });
};
