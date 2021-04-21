exports.up = (knex) =>
  knex.schema.createTable("customer", (table) => {
    table.increments("id");
    table.string("name").notNullable();
    table.string("document").notNullable();
    table.string("address").notNullable();
    table.string("contact").notNullable();

    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());

    table.unique("document");
  });

exports.down = (knex) => knex.schema.dropTable("customer");
