const { Pool } = require('pg');

let pool;

if (process.env.DATABASE_URL) {
  // Production: PostgreSQL on Railway
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });
  console.log('✅ Using PostgreSQL (Railway)');
} else {
  // Development: SQLite (local)
  const sqlite3 = require('sqlite3').verbose();
  const path = require('path');
  const dbPath = path.join(__dirname, '../../database.sqlite');
  pool = new sqlite3.Database(dbPath);
  console.log('✅ Using SQLite (Local)');
}

module.exports = pool;