import knex from 'knex';
import dotenv from 'dotenv';

dotenv.config(); // ✅ Load environment variables

const db = knex({
  client: 'pg',
  connection: {
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false } // ✅ Required for Render
  },
  pool: { min: 0, max: 7 }
});

export default db;
