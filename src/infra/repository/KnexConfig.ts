import knex from "knex";
export const knexInstance = knex({
  client: "pg",
  connection: {
    host: process.env.DATABASE_HOST,
    port: process.env.DATABASE_PORT ? Number(process.env.DATABASE_PORT):5432, 
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
  },

});
