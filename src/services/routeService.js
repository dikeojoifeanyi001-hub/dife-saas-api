const db = require('../config/db');

const routeService = {
  // Create a new route
  async createRoute(routeData) {
    const { origin, destination, driverId, companyId } = routeData;
    
    return new Promise((resolve, reject) => {
      // First verify driver belongs to this company
      db.get(
        'SELECT id FROM drivers WHERE id = ? AND company_id = ?',
        [driverId, companyId],
        (err, driver) => {
          if (err) return reject(err);
          if (!driver) return reject(new Error('Driver not found or unauthorized'));

          // Calculate risk score (basic logic)
          let riskScore = 0;
          if (origin && destination) {
            // Simple risk calculation based on distance indicator
            const originLen = origin.length;
            const destLen = destination.length;
            riskScore = Math.min(Math.floor((originLen + destLen) * 2.5), 100);
          }

          // Create route
          db.run(
            'INSERT INTO routes (origin, destination, driver_id, risk_score) VALUES (?, ?, ?, ?)',
            [origin, destination, driverId, riskScore],
            function(err) {
              if (err) return reject(err);
              
              resolve({
                id: this.lastID,
                origin: origin,
                destination: destination,
                driver_id: driverId,
                risk_score: riskScore
              });
            }
          );
        }
      );
    });
  },

  // Get all routes for a company
  async getRoutesByCompany(companyId) {
    return new Promise((resolve, reject) => {
      db.all(
        `SELECT r.id, r.origin, r.destination, r.risk_score, r.created_at,
         d.name as driver_name
         FROM routes r
         LEFT JOIN drivers d ON r.driver_id = d.id
         WHERE d.company_id = ? OR d.company_id IS NULL
         ORDER BY r.created_at DESC`,
        [companyId],
        (err, rows) => {
          if (err) return reject(err);
          resolve(rows);
        }
      );
    });
  },

  // Get a single route by ID
  async getRouteById(id, companyId) {
    return new Promise((resolve, reject) => {
      db.get(
        `SELECT r.id, r.origin, r.destination, r.risk_score, r.created_at,
         d.name as driver_name, d.id as driver_id
         FROM routes r
         LEFT JOIN drivers d ON r.driver_id = d.id
         WHERE r.id = ? AND (d.company_id = ? OR d.company_id IS NULL)`,
        [id, companyId],
        (err, row) => {
          if (err) return reject(err);
          if (!row) return reject(new Error('Route not found'));
          resolve(row);
        }
      );
    });
  },

  // Update a route
  async updateRoute(id, companyId, routeData) {
    const { origin, destination, driverId } = routeData;
    
    return new Promise((resolve, reject) => {
      // Verify driver belongs to company if provided
      const checkDriver = driverId ? 
        new Promise((res, rej) => {
          db.get('SELECT id FROM drivers WHERE id = ? AND company_id = ?', [driverId, companyId], (err, row) => {
            if (err) return rej(err);
            if (!row) return rej(new Error('Driver not found or unauthorized'));
            res(true);
          });
        }) : Promise.resolve(true);

      checkDriver.then(() => {
        // Calculate new risk score
        let riskScore = 0;
        if (origin && destination) {
          riskScore = Math.min(Math.floor((origin.length + destination.length) * 2.5), 100);
        }

        let query = 'UPDATE routes SET ';
        const params = [];
        
        if (origin) {
          query += 'origin = ?, ';
          params.push(origin);
        }
        if (destination) {
          query += 'destination = ?, ';
          params.push(destination);
        }
        if (driverId) {
          query += 'driver_id = ?, ';
          params.push(driverId);
        }
        query += 'risk_score = ? WHERE id = ?';
        params.push(riskScore, id);

        db.run(query, params, function(err) {
          if (err) return reject(err);
          if (this.changes === 0) return reject(new Error('Route not found'));
          
          resolve({ id, origin, destination, driver_id: driverId, risk_score: riskScore });
        });
      }).catch(reject);
    });
  },

  // Delete a route
  async deleteRoute(id, companyId) {
    return new Promise((resolve, reject) => {
      db.run(
        `DELETE FROM routes WHERE id = ? AND driver_id IN 
         (SELECT id FROM drivers WHERE company_id = ?)`,
        [id, companyId],
        function(err) {
          if (err) return reject(err);
          if (this.changes === 0) return reject(new Error('Route not found'));
          resolve({ message: 'Route deleted successfully' });
        }
      );
    });
  }
};

module.exports = routeService;