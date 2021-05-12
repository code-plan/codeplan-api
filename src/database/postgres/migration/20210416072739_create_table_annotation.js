exports.up = (knex) =>
  knex.schema.createTable("annotation", (table) => {
    table.increments("id");
    table.integer("project_id").notNullable();
    table.integer("profile_id").notNullable();
    table.string("content").notNullable();

    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());

    table
      .foreign("project_id")
      .references("project.id")
      .onUpdate("CASCADE")
      .onDelete("CASCADE");
    table
      .foreign("profile_id")
      .references("profile.id")
      .onUpdate("CASCADE")
      .onDelete("CASCADE");
  });

exports.down = (knex) => knex.schema.dropTable("annotation");
