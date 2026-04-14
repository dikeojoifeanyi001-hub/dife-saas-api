const bcrypt = require('bcrypt');
const db = require('../config/db');
const generateToken = require('../utils/generateToken');

const authService = {
  async register(userData) {
    const { name, email, password, companyName } = userData;

    return new Promise((resolve, reject) => {
      // Check if user already exists
      db.get('SELECT id FROM users WHERE email = ?', [email], async (err, row) => {
        if (err) return reject(err);
        if (row) return reject(new Error('User already exists'));

        // Create company
        db.run('INSERT INTO companies (name) VALUES (?)', [companyName], function(err) {
          if (err) return reject(err);
          const companyId = this.lastID;

          // Hash password
          bcrypt.hash(password, 10, (err, hashedPassword) => {
            if (err) return reject(err);

            // Create user
            db.run(
              'INSERT INTO users (name, email, password, company_id, role) VALUES (?, ?, ?, ?, ?)',
              [name, email, hashedPassword, companyId, 'company_user'],
              function(err) {
                if (err) return reject(err);

                const token = generateToken(this.lastID, companyId, 'company_user');

                resolve({
                  user: {
                    id: this.lastID,
                    name: name,
                    email: email,
                    companyId: companyId,
                    role: 'company_user'
                  },
                  token
                });
              }
            );
          });
        });
      });
    });
  },

  async login(email, password) {
    return new Promise((resolve, reject) => {
      db.get(
        'SELECT id, name, email, password, company_id, role FROM users WHERE email = ?',
        [email],
        async (err, user) => {
          if (err) return reject(err);
          if (!user) return reject(new Error('Invalid credentials'));

          const isValidPassword = await bcrypt.compare(password, user.password);
          if (!isValidPassword) return reject(new Error('Invalid credentials'));

          const token = generateToken(user.id, user.company_id, user.role);

          resolve({
            user: {
              id: user.id,
              name: user.name,
              email: user.email,
              companyId: user.company_id,
              role: user.role
            },
            token
          });
        }
      );
    });
  }
};

module.exports = authService;