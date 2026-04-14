const db = require('../config/db');

const routeService = {
  async createRoute(routeData) {
    const { origin, destination, driverId, companyId } = routeData;
    
    // Verify driver belongs to company
    const driverCheck = await db.query('SELECT id FROM drivers WHERE id = $1 AND company_id = $2', [driverId, companyId]);
    if (driverCheck.rows.length === 0) throw new Error('Driver not found or unauthorized');
    
    let riskScore = Math.min(Math.floor((origin.length + destination.length) * 2.5), 100);
    
    const result = await db.query(
      'INSERT INTO routes (origin, destination, driver_id, risk_score) VALUES ($1, $2, $3, $4) RETURNING id, origin, destination, driver_id, risk_score',
      [origin, destination, driverId, riskScore]
    );
    return result.rows[0];
  },

  async getRoutesByCompany(companyId) {
    const result = await db.query(
      `SELECT r.id, r.origin, r.destination, r.risk_score, r.created_at, d.name as driver_name
       FROM routes r
       LEFT JOIN drivers d ON r.driver_id = d.id
       WHERE d.company_id = $1 OR d.company_id IS NULL
       ORDER BY r.created_at DESC`,
      [companyId]
    );
    return result.rows;
  },

  async getRouteById(id, companyId) {
    const result = await db.query(
      `SELECT r.id, r.origin, r.destination, r.risk_score, r.created_at, d.name as driver_name, d.id as driver_id
       FROM routes r
       LEFT JOIN drivers d ON r.driver_id = d.id
       WHERE r.id = $1 AND (d.company_id = $2 OR d.company_id IS NULL)`,
      [id, companyId]
    );
    if (result.rows.length === 0) throw new Error('Route not found');
    return result.rows[0];
  },

  async deleteRoute(id, companyId) {
    const result = await db.query(
      `DELETE FROM routes WHERE id = $1 AND driver_id IN (SELECT id FROM drivers WHERE company_id = $2)`,
      [id, companyId]
    );
    if (result.rowCount === 0) throw new Error('Route not found');
    return { message: 'Route deleted successfully' };
  }
};

module.exports = routeService;