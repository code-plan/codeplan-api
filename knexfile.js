module.exports = {
  development: {
    client: "pg",
    connection: {
      host: process.env.PGSQL_HOST,
      database: process.env.PGSQL_DBNAME,
      user: process.env.PGSQL_USER,
      password: process.env.PGSQL_PASSWORD,
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: "migrations",
      directory: "./src/database/postgres/migration",
    },
  },
};
