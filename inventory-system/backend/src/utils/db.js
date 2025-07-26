import knex from 'knex';

const db = knex({
  client: 'pg',
  connection: {
    host: 'localhost',
    port: 5432,
    user: 'postgres',
    password: 'postgres',  // ← Replace this
    database: 'inventory',
  },
  pool: { min: 0, max: 7 },
});

export default db;
