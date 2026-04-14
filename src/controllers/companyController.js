const companyService = require('../services/companyService');

const companyController = {
  // Get current user's company info
  async getMyCompany(req, res) {
    try {
      const companyId = req.user.companyId;
      const company = await companyService.getCompanyById(companyId);
      const stats = await companyService.getCompanyStats(companyId);
      
      res.status(200).json({
        success: true,
        data: {
          ...company,
          stats
        }
      });
    } catch (error) {
      console.error('Get company error:', error.message);
      if (error.message === 'Company not found') {
        return res.status(404).json({ error: error.message });
      }
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  // Get all companies (Admin only)
  async getAllCompanies(req, res) {
    try {
      // Check if user is admin (you can expand role check)
      if (req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Admin access required' });
      }
      
      const companies = await companyService.getAllCompanies();
      
      res.status(200).json({
        success: true,
        count: companies.length,
        data: companies
      });
    } catch (error) {
      console.error('Get all companies error:', error.message);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  // Update company
  async updateCompany(req, res) {
    try {
      const companyId = req.user.companyId;
      const { name } = req.body;
      
      if (!name) {
        return res.status(400).json({ error: 'Company name is required' });
      }
      
      const company = await companyService.updateCompany(companyId, name);
      
      res.status(200).json({
        success: true,
        message: 'Company updated successfully',
        data: company
      });
    } catch (error) {
      if (error.message === 'Company not found') {
        return res.status(404).json({ error: error.message });
      }
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  // Get company statistics
  async getCompanyStats(req, res) {
    try {
      const companyId = req.user.companyId;
      const stats = await companyService.getCompanyStats(companyId);
      
      res.status(200).json({
        success: true,
        data: stats
      });
    } catch (error) {
      console.error('Get company stats error:', error.message);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
};

module.exports = companyController;