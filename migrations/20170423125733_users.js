exports.up = function(knex) {
  return knex.schema.createTable('users', (table) => {
    table.increments();
    table.varchar('first_name').notNullable().defaultTo('');
    table.varchar('last_name').notNullable().defaultTo('');
    table.varchar('email').notNullable().unique();
    table.specificType('hashed_password', 'char(60)').notNullable().defaultTo(true);
    table.timestamps(true, true);
  })
};

exports.down = function(knex) {
  return knex.schema.dropTable('users');
};
