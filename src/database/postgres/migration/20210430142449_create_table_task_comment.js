exports.up = (knex) =>
  knex.schema.createTable("task_comment", (table) => {
    table.increments("id");
    table.integer("task_id").notNullable();
    table.integer("profile_id").notNullable();
    table.string("content").notNullable();

    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());

    table
      .foreign("task_id")
      .references("task.id")
      .onUpdate("CASCADE")
      .onDelete("CASCADE");
    table
      .foreign("profile_id")
      .references("profile.id")
      .onUpdate("CASCADE")
      .onDelete("CASCADE");
  });

exports.down = (knex) => knex.schema.dropTable("task_comment");
