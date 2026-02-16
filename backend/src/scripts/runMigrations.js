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

    // Check if migration was already run
    const checkResult = await client.query(
      'SELECT * FROM schema_migrations WHERE filename = $1',
      ['001_initial_schema.sql']
    );

    if (checkResult.rows.length > 0) {
      console.log('✅ Migrations already applied');
      return;
    }

    // Check if tables already exist (for existing databases)
    const tableCheck = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name = 'users'
    `);

    if (tableCheck.rows.length > 0) {
      console.log('⚠️  Tables already exist, marking migration as complete');
      await client.query(
        'INSERT INTO schema_migrations (filename) VALUES ($1) ON CONFLICT (filename) DO NOTHING',
        ['001_initial_schema.sql']
      );
      console.log('✅ Migration marked as complete');
      return;
    }

    // Read and execute migration
    const migrationsDir = path.join(__dirname, '../../migrations');
    const migrationFile = path.join(migrationsDir, '001_initial_schema.sql');

    if (!fs.existsSync(migrationFile)) {
      console.log('⚠️  No migration file found, skipping');
      return;
    }

    const migrationSQL = fs.readFileSync(migrationFile, 'utf8');
    
    await client.query('BEGIN');
    
    // Execute migration
    await client.query(migrationSQL);
    
    // Mark as executed
    await client.query(
      'INSERT INTO schema_migrations (filename) VALUES ($1)',
      ['001_initial_schema.sql']
    );
    
    await client.query('COMMIT');

    console.log('✅ Migrations completed successfully');
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Migration failed:', error.message);
    
    // Don't crash the app if tables already exist
    if (error.code === '42P07') { // duplicate table
      console.log('⚠️  Tables already exist, continuing...');
      try {
        await client.query(
          'INSERT INTO schema_migrations (filename) VALUES ($1) ON CONFLICT (filename) DO NOTHING',
          ['001_initial_schema.sql']
        );
      } catch (e) {
        // Ignore
      }
      return;
    }
    
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

export default runMigrations;
