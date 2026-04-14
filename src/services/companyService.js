const db = require('../config/db');

const companyService = {
  // Get company by ID
  async getCompanyById(companyId) {
    return new Promise((resolve, reject) => {
      db.get(
        'SELECT id, name, created_at FROM companies WHERE id = ?',
        [companyId],
        (err, row) => {
          if (err) return reject(err);
          if (!row) return reject(new Error('Company not found'));
          resolve(row);
        }
      );
    });
  },

  // Get all companies (Admin only)
  async getAllCompanies() {
    return new Promise((resolve, reject) => {
      db.all(
        'SELECT id, name, created_at FROM companies ORDER BY created_at DESC',
        [],
        (err, rows) => {
          if (err) return reject(err);
          resolve(rows || []);
        }
      );
    });
  },

  // Update company name
  async updateCompany(companyId, name) {
    return new Promise((resolve, reject) => {
      db.run(
        'UPDATE companies SET name = ? WHERE id = ?',
        [name, companyId],
        function(err) {
          if (err) return reject(err);
          if (this.changes === 0) return reject(new Error('Company not found'));
          resolve({ id: companyId, name: name });
        }
      );
    });
  },

  // Get company statistics (drivers count, routes count, average risk)
  async getCompanyStats(companyId) {
    return new Promise((resolve, reject) => {
      db.get(
        `SELECT 
          (SELECT COUNT(*) FROM drivers WHERE company_id = ?) as total_drivers,
          (SELECT COUNT(*) FROM routes r 
           LEFT JOIN drivers d ON r.driver_id = d.id 
           WHERE d.company_id = ?) as total_routes,
          (SELECT COALESCE(AVG(r.risk_score), 0) FROM routes r 
           LEFT JOIN drivers d ON r.driver_id = d.id 
           WHERE d.company_id = ?) as avg_risk_score
        `,
        [companyId, companyId, companyId],
        (err, row) => {
          if (err) return reject(err);
          resolve({
            total_drivers: row?.total_drivers || 0,
            total_routes: row?.total_routes || 0,
            avg_risk_score: Math.round(row?.avg_risk_score || 0)
          });
        }
      );
    });
  }
};

module.exports = companyService;