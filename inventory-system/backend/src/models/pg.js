import knex from 'knex';

export const pg = knex({
  client: 'pg',
  connection: process.env.DATABASE_URL
});
