const express = require('express');
const driverController = require('../controllers/driverController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// All driver routes require authentication
router.use(authMiddleware);

router.post('/', driverController.createDriver);
router.get('/', driverController.getDrivers);
router.get('/:id', driverController.getDriverById);
router.put('/:id', driverController.updateDriver);
router.delete('/:id', driverController.deleteDriver);

module.exports = router;