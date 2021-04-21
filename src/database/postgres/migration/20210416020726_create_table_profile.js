exports.up = (knex) =>
  knex.schema.createTable("profile", (table) => {
    table.increments("id");
    table.integer("user_id").notNullable();
    table.string("name").notNullable();
    table.string("surname").notNullable();
    table.string("email").notNullable();
    table.string("phone_number").notNullable();
    table.string("confirmation_code").notNullable();
    table.boolean("confirmed").notNullable().defaultTo(false);

    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());

    table
      .foreign("user_id")
      .references("user.id")
      .onUpdate("CASCADE")
      .onDelete("CASCADE");
  });

exports.down = (knex) => knex.schema.dropTable("profile");
