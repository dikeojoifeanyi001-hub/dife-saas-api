const db = require('../config/db');

const driverService = {
  // Create a new driver
  async createDriver(driverData) {
    const { name, companyId } = driverData;
    
    return new Promise((resolve, reject) => {
      db.run(
        'INSERT INTO drivers (name, company_id) VALUES (?, ?)',
        [name, companyId],
        function(err) {
          if (err) return reject(err);
          
          resolve({
            id: this.lastID,
            name: name,
            company_id: companyId
          });
        }
      );
    });
  },

  // Get all drivers for a company
  async getDriversByCompany(companyId) {
    return new Promise((resolve, reject) => {
      db.all(
        'SELECT id, name, created_at FROM drivers WHERE company_id = ? ORDER BY created_at DESC',
        [companyId],
        (err, rows) => {
          if (err) return reject(err);
          resolve(rows);
        }
      );
    });
  },

  // Get a single driver by ID
  async getDriverById(id, companyId) {
    return new Promise((resolve, reject) => {
      db.get(
        'SELECT id, name, created_at FROM drivers WHERE id = ? AND company_id = ?',
        [id, companyId],
        (err, row) => {
          if (err) return reject(err);
          if (!row) return reject(new Error('Driver not found'));
          resolve(row);
        }
      );
    });
  },

  // Update a driver
  async updateDriver(id, companyId, name) {
    return new Promise((resolve, reject) => {
      db.run(
        'UPDATE drivers SET name = ? WHERE id = ? AND company_id = ?',
        [name, id, companyId],
        function(err) {
          if (err) return reject(err);
          if (this.changes === 0) return reject(new Error('Driver not found'));
          
          resolve({ id, name, company_id: companyId });
        }
      );
    });
  },

  // Delete a driver
  async deleteDriver(id, companyId) {
    return new Promise((resolve, reject) => {
      db.run(
        'DELETE FROM drivers WHERE id = ? AND company_id = ?',
        [id, companyId],
        function(err) {
          if (err) return reject(err);
          if (this.changes === 0) return reject(new Error('Driver not found'));
          
          resolve({ message: 'Driver deleted successfully' });
        }
      );
    });
  }
};

module.exports = driverService;