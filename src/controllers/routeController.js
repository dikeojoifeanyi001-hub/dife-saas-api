const routeService = require('../services/routeService');

const routeController = {
  async createRoute(req, res) {
    try {
      const { origin, destination, driverId } = req.body;
      const companyId = req.user.companyId;

      if (!origin || !destination || !driverId) {
        return res.status(400).json({ error: 'origin, destination, and driverId are required' });
      }

      const route = await routeService.createRoute({ origin, destination, driverId, companyId });
      
      res.status(201).json({
        success: true,
        message: 'Route created successfully',
        data: route
      });
    } catch (error) {
      console.error('Create route error:', error.message);
      if (error.message === 'Driver not found or unauthorized') {
        return res.status(404).json({ error: error.message });
      }
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  async getRoutes(req, res) {
    try {
      const companyId = req.user.companyId;
      const routes = await routeService.getRoutesByCompany(companyId);
      
      res.status(200).json({
        success: true,
        count: routes.length,
        data: routes
      });
    } catch (error) {
      console.error('Get routes error:', error.message);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  async getRouteById(req, res) {
    try {
      const { id } = req.params;
      const companyId = req.user.companyId;
      
      const route = await routeService.getRouteById(id, companyId);
      
      res.status(200).json({
        success: true,
        data: route
      });
    } catch (error) {
      if (error.message === 'Route not found') {
        return res.status(404).json({ error: error.message });
      }
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  async updateRoute(req, res) {
    try {
      const { id } = req.params;
      const { origin, destination, driverId } = req.body;
      const companyId = req.user.companyId;

      const route = await routeService.updateRoute(id, companyId, { origin, destination, driverId });
      
      res.status(200).json({
        success: true,
        message: 'Route updated successfully',
        data: route
      });
    } catch (error) {
      if (error.message === 'Route not found' || error.message === 'Driver not found or unauthorized') {
        return res.status(404).json({ error: error.message });
      }
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  async deleteRoute(req, res) {
    try {
      const { id } = req.params;
      const companyId = req.user.companyId;
      
      await routeService.deleteRoute(id, companyId);
      
      res.status(200).json({
        success: true,
        message: 'Route deleted successfully'
      });
    } catch (error) {
      if (error.message === 'Route not found') {
        return res.status(404).json({ error: error.message });
      }
      res.status(500).json({ error: 'Internal server error' });
    }
  }
};

module.exports = routeController;