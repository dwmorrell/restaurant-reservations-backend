/**
 * Knex configuration file.
 *
 */

require('dotenv').config();
const path = require("path");

// const {
//   DATABASE_URL = "postgres://qzohricj:SWJUtSrkW8Jt6v-JdXNwqhZKk4z6y5jQ@heffalump.db.elephantsql.com/qzohricj",
//   DATABASE_URL_DEVELOPMENT = "postgresql://postgres@localhost/postgres",
//   DATABASE_URL_TEST = "postgresql://postgres@localhost/postgres",
//   DATABASE_URL_PREVIEW = "postgresql://postgres@localhost/postgres",
//   DEBUG,
// } = process.env;

DATABASE_URL="postgres://qzohricj:SWJUtSrkW8Jt6v-JdXNwqhZKk4z6y5jQ@heffalump.db.elephantsql.com/qzohricj"
DATABASE_URL_DEVELOPMENT="postgres://qzohricj:SWJUtSrkW8Jt6v-JdXNwqhZKk4z6y5jQ@heffalump.db.elephantsql.com/qzohricj"
DATABASE_URL_TEST="postgres://qzohricj:SWJUtSrkW8Jt6v-JdXNwqhZKk4z6y5jQ@heffalump.db.elephantsql.com/qzohricj"
DATABASE_URL_PREVIEW="postgres://qzohricj:SWJUtSrkW8Jt6v-JdXNwqhZKk4z6y5jQ@heffalump.db.elephantsql.com/qzohricj"

module.exports = {
  development: {
    client: "postgresql",
    pool: { min: 1, max: 5 },
    connection: DATABASE_URL_DEVELOPMENT,
    migrations: {
      directory: path.join(__dirname, "src", "db", "migrations"),
    },
    seeds: {
      directory: path.join(__dirname, "src", "db", "seeds"),
    },
    debug: !!DEBUG,
  },
  test: {
    client: "postgresql",
    pool: { min: 1, max: 5 },
    connection: DATABASE_URL_TEST,
    migrations: {
      directory: path.join(__dirname, "src", "db", "migrations"),
    },
    seeds: {
      directory: path.join(__dirname, "src", "db", "seeds"),
    },
    debug: !!DEBUG,
  },
  preview: {
    client: "postgresql",
    pool: { min: 1, max: 5 },
    connection: DATABASE_URL_PREVIEW,
    migrations: {
      directory: path.join(__dirname, "src", "db", "migrations"),
    },
    seeds: {
      directory: path.join(__dirname, "src", "db", "seeds"),
    },
    debug: !!DEBUG,
  },
  production: {
    client: "postgresql",
    pool: { min: 1, max: 5 },
    connection: DATABASE_URL,
    migrations: {
      directory: path.join(__dirname, "src", "db", "migrations"),
    },
    seeds: {
      directory: path.join(__dirname, "src", "db", "seeds"),
    },
    debug: !!DEBUG,
  },
};
