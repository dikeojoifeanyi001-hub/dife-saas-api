const db = require('../config/db');

const riskController = {
  async getRiskByRouteId(req, res) {
    try {
      const { routeId } = req.params;
      const companyId = req.user.companyId;

      const result = await db.query(
        `SELECT r.id, r.origin, r.destination, r.risk_score, d.name as driver_name
         FROM routes r
         LEFT JOIN drivers d ON r.driver_id = d.id
         WHERE r.id = $1 AND (d.company_id = $2 OR d.company_id IS NULL)`,
        [routeId, companyId]
      );
      
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Route not found' });
      }
      
      const route = result.rows[0];
      let riskLevel = 'Low';
      if (route.risk_score > 70) riskLevel = 'High';
      else if (route.risk_score > 40) riskLevel = 'Medium';

      return res.status(200).json({
        success: true,
        data: {
          route_id: route.id,
          origin: route.origin,
          destination: route.destination,
          driver_name: route.driver_name,
          risk_score: route.risk_score,
          risk_level: riskLevel,
          recommendation: riskLevel === 'High' ? 'Immediate review required' : 
                          riskLevel === 'Medium' ? 'Monitor closely' : 'Normal operations'
        }
      });
    } catch (error) {
      console.error('Get risk error:', error.message);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  async getAllRisks(req, res) {
    try {
      const companyId = req.user.companyId;

      const result = await db.query(
        `SELECT r.id, r.origin, r.destination, r.risk_score, d.name as driver_name
         FROM routes r
         LEFT JOIN drivers d ON r.driver_id = d.id
         WHERE d.company_id = $1 OR d.company_id IS NULL
         ORDER BY r.risk_score DESC`,
        [companyId]
      );
      
      const routes = result.rows;
      const risks = routes.map(route => ({
        route_id: route.id,
        origin: route.origin,
        destination: route.destination,
        driver_name: route.driver_name,
        risk_score: route.risk_score,
        risk_level: route.risk_score > 70 ? 'High' : (route.risk_score > 40 ? 'Medium' : 'Low')
      }));

      const highRiskCount = risks.filter(r => r.risk_level === 'High').length;
      const avgRiskScore = routes.length > 0 ? 
        Math.round(routes.reduce((sum, r) => sum + r.risk_score, 0) / routes.length) : 0;

      return res.status(200).json({
        success: true,
        summary: {
          total_routes: routes.length,
          high_risk_count: highRiskCount,
          average_risk_score: avgRiskScore
        },
        data: risks
      });
    } catch (error) {
      console.error('Get all risks error:', error.message);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
};

module.exports = riskController;