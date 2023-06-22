const { PGHOST, PGDATABASE, PGUSER, PGPASSWORD } = process.env;
const knex = require("knex")({
  client: "pg",
  connection: {
    host: PGHOST,
    user: PGUSER,
    password: PGPASSWORD,
    database: PGDATABASE,

    /* ssl: {
      rejectUnauthorized: false,
    }, */
  },
});

module.exports = knex;
