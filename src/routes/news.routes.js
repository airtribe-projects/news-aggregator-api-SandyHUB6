const express = require('express');
const router = express.Router();
const newsController = require('../controllers/news.controller');
const authenticateToken = require('../middleware/auth.middleware');

// GET / (protected route to fetch news)
router.get('/', authenticateToken, newsController.getNews);

module.exports = router;
