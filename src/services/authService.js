const bcrypt = require('bcrypt');
const generateToken = require('../utils/generateToken');

let db;
if (process.env.DATABASE_URL) {
  // PostgreSQL mode
  db = require('../config/db');
} else {
  // SQLite mode (local)
  db = require('../config/db');
}

const authService = {
  async register(userData) {
    const { name, email, password, companyName } = userData;

    if (process.env.DATABASE_URL) {
      // PostgreSQL version
      const client = await db.connect();
      try {
        await client.query('BEGIN');
        
        // Check if user exists
        const userCheck = await client.query('SELECT id FROM users WHERE email = $1', [email]);
        if (userCheck.rows.length > 0) throw new Error('User already exists');
        
        // Create company
        const companyResult = await client.query('INSERT INTO companies (name) VALUES ($1) RETURNING id', [companyName]);
        const companyId = companyResult.rows[0].id;
        
        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);
        
        // Create user
        const userResult = await client.query(
          'INSERT INTO users (name, email, password, company_id, role) VALUES ($1, $2, $3, $4, $5) RETURNING id, name, email, company_id, role',
          [name, email, hashedPassword, companyId, 'company_user']
        );
        
        await client.query('COMMIT');
        
        const user = userResult.rows[0];
        const token = generateToken(user.id, user.company_id, user.role);
        
        return {
          user: { id: user.id, name: user.name, email: user.email, companyId: user.company_id, role: user.role },
          token
        };
      } catch (error) {
        await client.query('ROLLBACK');
        throw error;
      } finally {
        client.release();
      }
    } else {
      // SQLite version (your existing code)
      return new Promise((resolve, reject) => {
        db.get('SELECT id FROM users WHERE email = ?', [email], async (err, row) => {
          if (err) return reject(err);
          if (row) return reject(new Error('User already exists'));
          
          db.run('INSERT INTO companies (name) VALUES (?)', [companyName], function(err) {
            if (err) return reject(err);
            const companyId = this.lastID;
            
            bcrypt.hash(password, 10, (err, hashedPassword) => {
              if (err) return reject(err);
              
              db.run('INSERT INTO users (name, email, password, company_id, role) VALUES (?, ?, ?, ?, ?)',
                [name, email, hashedPassword, companyId, 'company_user'],
                function(err) {
                  if (err) return reject(err);
                  const token = generateToken(this.lastID, companyId, 'company_user');
                  resolve({ user: { id: this.lastID, name, email, companyId, role: 'company_user' }, token });
                }
              );
            });
          });
        });
      });
    }
  },

  async login(email, password) {
    if (process.env.DATABASE_URL) {
      // PostgreSQL version
      const result = await db.query(
        'SELECT id, name, email, password, company_id, role FROM users WHERE email = $1',
        [email]
      );
      
      if (result.rows.length === 0) throw new Error('Invalid credentials');
      
      const user = result.rows[0];
      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) throw new Error('Invalid credentials');
      
      const token = generateToken(user.id, user.company_id, user.role);
      
      return {
        user: { id: user.id, name: user.name, email: user.email, companyId: user.company_id, role: user.role },
        token
      };
    } else {
      // SQLite version
      return new Promise((resolve, reject) => {
        db.get('SELECT id, name, email, password, company_id, role FROM users WHERE email = ?', [email], async (err, user) => {
          if (err) return reject(err);
          if (!user) return reject(new Error('Invalid credentials'));
          
          const isValidPassword = await bcrypt.compare(password, user.password);
          if (!isValidPassword) return reject(new Error('Invalid credentials'));
          
          const token = generateToken(user.id, user.company_id, user.role);
          resolve({ user: { id: user.id, name: user.name, email: user.email, companyId: user.company_id, role: user.role }, token });
        });
      });
    }
  }
};

module.exports = authService;