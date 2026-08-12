/**
 * Centralized error handling middleware.
 * Formats errors and returns them as a consistent JSON payload.
 */
const errorHandler = (err, req, res, next) => {
    // Log the error details to the console for server debugging
    console.error(err.stack || err);

    // Get status code from error if defined, otherwise default to 500 Internal Server Error
    const statusCode = err.status || err.statusCode || 500;
    const message = err.message || 'Internal Server Error';

    res.status(statusCode).json({
        error: {
            message: message,
            status: statusCode
        }
    });
};

module.exports = errorHandler;
