const express = require('express');
const companyController = require('../controllers/companyController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// All company routes require authentication
router.use(authMiddleware);

router.get('/me', companyController.getMyCompany);
router.get('/stats', companyController.getCompanyStats);
router.put('/me', companyController.updateCompany);
router.get('/all', companyController.getAllCompanies); // Admin only

module.exports = router;