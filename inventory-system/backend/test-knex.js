import knex from 'knex';
import dotenv from 'dotenv';
dotenv.config();

const db = knex({
  client: 'pg',
  connection: process.env.POSTGRES_URL
});

db.raw('SELECT 1')
  .then(() => {
    console.log('✅ Connected to PostgreSQL via knex!');
    process.exit(0);
  })
  .catch(err => {
    console.error('❌ knex connection error:', err.message);
    process.exit(1);
  });
