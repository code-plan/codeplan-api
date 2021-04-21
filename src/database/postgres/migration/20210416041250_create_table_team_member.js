exports.up = (knex) =>
  knex.schema.createTable("team_member", (table) => {
    table.increments("id");
    table.integer("team_id").notNullable();
    table.integer("profile_id").notNullable();

    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());

    table
      .foreign("team_id")
      .references("team.id")
      .onUpdate("CASCADE")
      .onDelete("CASCADE");
    table
      .foreign("profile_id")
      .references("profile.id")
      .onUpdate("CASCADE")
      .onDelete("CASCADE");
  });

exports.down = (knex) => knex.schema.dropTable("team_member");
