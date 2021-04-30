exports.up = (knex) =>
  knex.schema.createTable("project", (table) => {
    table.increments("id");
    table.integer("customer_id").notNullable();
    table.string("name").notNullable();

    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());

    table
      .foreign("customer_id")
      .references("customer.id")
      .onUpdate("CASCADE")
      .onDelete("CASCADE");
  });

exports.down = (knex) => knex.schema.dropTable("project");
