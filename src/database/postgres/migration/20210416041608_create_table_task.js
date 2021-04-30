exports.up = (knex) =>
  knex.schema.createTable("task", (table) => {
    table.increments("id");
    table.integer("project_id").notNullable();
    table.integer("team_id").notNullable();
    table.string("content_preview").notNullable();
    table.string("content").notNullable();
    table.boolean("active").notNullable().defaultTo(true);
    table.string("deactivate_reason").notNullable().defaultTo("");
    table.boolean("recurrent").notNullable().defaultTo(false);
    table.timestamp("begin_date").notNullable();
    table.timestamp("end_date");

    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());

    table
      .foreign("project_id")
      .references("project.id")
      .onUpdate("CASCADE")
      .onDelete("CASCADE");
    table
      .foreign("team_id")
      .references("team.id")
      .onUpdate("CASCADE")
      .onDelete("CASCADE");
  });

exports.down = (knex) => knex.schema.dropTable("task");
