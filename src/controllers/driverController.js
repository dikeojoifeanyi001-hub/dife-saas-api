const driverService = require('../services/driverService');

const driverController = {
  async createDriver(req, res) {
    try {
      const { name } = req.body;
      const companyId = req.user.companyId;

      if (!name) {
        return res.status(400).json({ error: 'Driver name is required' });
      }

      const driver = await driverService.createDriver({ name, companyId });
      
      res.status(201).json({
        success: true,
        message: 'Driver created successfully',
        data: driver
      });
    } catch (error) {
      console.error('Create driver error:', error.message);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  async getDrivers(req, res) {
    try {
      const companyId = req.user.companyId;
      const drivers = await driverService.getDriversByCompany(companyId);
      
      res.status(200).json({
        success: true,
        count: drivers.length,
        data: drivers
      });
    } catch (error) {
      console.error('Get drivers error:', error.message);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  async getDriverById(req, res) {
    try {
      const { id } = req.params;
      const companyId = req.user.companyId;
      
      const driver = await driverService.getDriverById(id, companyId);
      
      res.status(200).json({
        success: true,
        data: driver
      });
    } catch (error) {
      if (error.message === 'Driver not found') {
        return res.status(404).json({ error: error.message });
      }
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  async updateDriver(req, res) {
    try {
      const { id } = req.params;
      const { name } = req.body;
      const companyId = req.user.companyId;

      if (!name) {
        return res.status(400).json({ error: 'Driver name is required' });
      }

      const driver = await driverService.updateDriver(id, companyId, name);
      
      res.status(200).json({
        success: true,
        message: 'Driver updated successfully',
        data: driver
      });
    } catch (error) {
      if (error.message === 'Driver not found') {
        return res.status(404).json({ error: error.message });
      }
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  async deleteDriver(req, res) {
    try {
      const { id } = req.params;
      const companyId = req.user.companyId;
      
      await driverService.deleteDriver(id, companyId);
      
      res.status(200).json({
        success: true,
        message: 'Driver deleted successfully'
      });
    } catch (error) {
      if (error.message === 'Driver not found') {
        return res.status(404).json({ error: error.message });
      }
      res.status(500).json({ error: 'Internal server error' });
    }
  }
};

module.exports = driverController;