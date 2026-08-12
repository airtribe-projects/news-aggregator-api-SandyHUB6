const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const authenticateToken = require('../middleware/auth.middleware');

// Public routes
router.post('/signup', userController.signup);
router.post('/login', userController.login);

// Protected routes (require token authentication)
router.get('/preferences', authenticateToken, userController.getPreferences);
router.put('/preferences', authenticateToken, userController.updatePreferences);

module.exports = router;
