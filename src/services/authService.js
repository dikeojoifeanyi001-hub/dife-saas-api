const bcrypt = require('bcrypt');
const db = require('../config/db');
const generateToken = require('../utils/generateToken');

const authService = {
  async register(userData) {
    const { name, email, password, companyName } = userData;

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
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          companyId: user.company_id,
          role: user.role
        },
        token
      };
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  },

  async login(email, password) {
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
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        companyId: user.company_id,
        role: user.role
      },
      token
    };
  }
};

module.exports = authService;