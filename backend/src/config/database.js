import pkg from 'pg';
const { Pool } = pkg;
import dotenv from 'dotenv';
import runMigrations from '../scripts/runMigrations.js';

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Test connection and run migrations
export const connectDB = async () => {
  try {
    const client = await pool.connect();
    console.log('✅ Connected to PostgreSQL database');
    client.release();
    
    // Run migrations automatically
    await runMigrations();
  } catch (error) {
    console.error('❌ Database connection error:', error);
    process.exit(1);
  }
}; 

// Query helper with logging
export const query = async (text, params) => {
  const start = Date.now();
  try {
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    console.log('Executed query', { text, duration, rows: res.rowCount });
    return res;
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
}; 

// Get client for transactions
export const getClient = async () => {
  const client = await pool.connect();
  return client;
};

export default pool;
