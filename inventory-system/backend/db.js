import knex from 'knex';
import dotenv from 'dotenv';

dotenv.config(); // ✅ Load .env variables

const db = knex({
  client: 'pg',
  connection: process.env.DATABASE_URL, // ✅ Use environment variable
  pool: { min: 0, max: 7 },
  ssl: { rejectUnauthorized: false } // ✅ Required for Render's external PostgreSQL
});

export default db;
