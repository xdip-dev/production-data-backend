import knex from "knex";
export const knexInstanceProdcution = knex({
  client: "pg",
  connection: {
    host: process.env.DATABASE_HOST,
    port: process.env.DATABASE_PORT ? Number(process.env.DATABASE_PORT):5432, 
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
  },

});

export const knexInstanceFiltro = knex({
  client: "pg",
  connection: {
    host: process.env.DB_HOST,
    port: 5432, 
    user: process.env.DB_USER,
    password: process.env.DB_FILTRO_PWD,
    database: process.env.DB_FILTRO,
  },

});
