const newsService = require('../services/news.service');

/**
 * News controller.
 * Handles HTTP requests for fetching news.
 */

/**
 * Handle GET /news
 */
const getNews = async (req, res, next) => {
    try {
        const preferences = req.user.preferences || [];
        const articles = await newsService.getNewsArticles(preferences);
        return res.status(200).json({ news: articles });
    } catch (err) {
        next(err);
    }
};

module.exports = {
    getNews
};
