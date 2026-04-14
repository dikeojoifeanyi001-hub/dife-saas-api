const express = require('express');
const routeController = require('../controllers/routeController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// All route routes require authentication
router.use(authMiddleware);

router.post('/', routeController.createRoute);
router.get('/', routeController.getRoutes);
router.get('/:id', routeController.getRouteById);
router.put('/:id', routeController.updateRoute);
router.delete('/:id', routeController.deleteRoute);

module.exports = router;