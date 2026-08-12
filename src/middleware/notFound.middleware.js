/**
 * 404 Not Found middleware.
 * Triggers when a request is made to an unregistered endpoint.
 */
const notFoundHandler = (req, res, next) => {
    res.status(404).json({
        error: {
            message: `Route not found: ${req.method} ${req.originalUrl}`,
            status: 404
        }
    });
};

module.exports = notFoundHandler;
