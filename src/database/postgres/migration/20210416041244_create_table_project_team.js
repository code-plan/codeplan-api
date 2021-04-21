exports.up = (knex) =>
  knex.schema.createTable("project_team", (table) => {
    table.increments("id");
    table.integer("project_id").notNullable();
    table.integer("team_id").notNullable();

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

exports.down = (knex) => knex.schema.dropTable("project_team");
