const { Pool } = require('pg');

// Railway provides DATABASE_URL automatically
if (!process.env.DATABASE_URL) {
  console.error('❌ DATABASE_URL is not set. Please add PostgreSQL database to your Railway project.');
  process.exit(1);
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

pool.connect((err, client, release) => {
  if (err) {
    console.error('❌ Database connection failed:', err.message);
  } else {
    console.log('✅ PostgreSQL database connected successfully');
    release();
  }
});

module.exports = pool;