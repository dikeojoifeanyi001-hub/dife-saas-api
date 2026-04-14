const db = require('../config/db');

const driverService = {
  async createDriver(driverData) {
    const { name, companyId } = driverData;
    const result = await db.query(
      'INSERT INTO drivers (name, company_id) VALUES ($1, $2) RETURNING id, name, company_id',
      [name, companyId]
    );
    return result.rows[0];
  },

  async getDriversByCompany(companyId) {
    const result = await db.query(
      'SELECT id, name, created_at FROM drivers WHERE company_id = $1 ORDER BY created_at DESC',
      [companyId]
    );
    return result.rows;
  },

  async getDriverById(id, companyId) {
    const result = await db.query(
      'SELECT id, name, created_at FROM drivers WHERE id = $1 AND company_id = $2',
      [id, companyId]
    );
    if (result.rows.length === 0) throw new Error('Driver not found');
    return result.rows[0];
  },

  async updateDriver(id, companyId, name) {
    const result = await db.query(
      'UPDATE drivers SET name = $1 WHERE id = $2 AND company_id = $3 RETURNING id, name, company_id',
      [name, id, companyId]
    );
    if (result.rows.length === 0) throw new Error('Driver not found');
    return result.rows[0];
  },

  async deleteDriver(id, companyId) {
    const result = await db.query(
      'DELETE FROM drivers WHERE id = $1 AND company_id = $2',
      [id, companyId]
    );
    if (result.rowCount === 0) throw new Error('Driver not found');
    return { message: 'Driver deleted successfully' };
  }
};

module.exports = driverService;