const express = require('express');
const riskController = require('../controllers/riskController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.use(authMiddleware);

router.get('/', riskController.getAllRisks);
router.get('/:routeId', riskController.getRiskByRouteId);

module.exports = router;