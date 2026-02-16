import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import pkg from 'pg';
const { Pool } = pkg;
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

async function runMigrations() {
  const client = await pool.connect();
  
  try {
    console.log('🔄 Running database migrations...');

    // Create migrations tracking table if it doesn't exist
    await client.query(`
      CREATE TABLE IF NOT EXISTS schema_migrations (
        id SERIAL PRIMARY KEY,
        filename VARCHAR(255) UNIQUE NOT NULL,
        executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Read migration file
    const migrationsDir = path.join(__dirname, '../../migrations');
    const migrationFile = path.join(migrationsDir, '001_initial_schema.sql');

    // Check if migration was already run
    const checkResult = await client.query(
      'SELECT * FROM schema_migrations WHERE filename = $1',
      ['001_initial_schema.sql']
    );

    if (checkResult.rows.length > 0) {
      console.log('✅ Migrations already applied');
      return;
    }

    // Read and execute migration
    const migrationSQL = fs.readFileSync(migrationFile, 'utf8');
    
    await client.query('BEGIN');
    await client.query(migrationSQL);
    await client.query(
      'INSERT INTO schema_migrations (filename) VALUES ($1)',
      ['001_initial_schema.sql']
    );
    await client.query('COMMIT');

    console.log('✅ Migrations completed successfully');
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Migration failed:', error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

export default runMigrations;
