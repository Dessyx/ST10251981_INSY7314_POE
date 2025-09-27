exports.up = function(knex) {
  return knex.schema.alterTable('transactions', table => {
    table.string('provider');
  });
};

exports.down = function(knex) {
  return knex.schema.alterTable('transactions', table => {
    table.dropColumn('provider');
  });
};
