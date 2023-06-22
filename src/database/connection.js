const { PGHOST, PGDATABASE, PGUSER, PGPASSWORD, ENDPOINT_ID } = process.env;
const knex = require("knex")({
  client: "pg",
  connection: {
    host: process.env.PGHOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,

    ssl: "require",
  },
});

module.exports = knex;
