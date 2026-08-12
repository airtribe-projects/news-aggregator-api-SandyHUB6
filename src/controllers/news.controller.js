/**
 * News controller (Stub).
 * Handles fetching news articles according to user preferences.
 */

const getNews = (req, res, next) => {
    return res.status(501).json({
        error: {
            message: 'Get news is not implemented yet.',
            status: 501
        }
    });
};

module.exports = {
    getNews
};
