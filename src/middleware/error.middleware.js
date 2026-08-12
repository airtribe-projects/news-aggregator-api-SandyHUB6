const AppError = require('../utils/appError');

/**
 * Centralized error handling middleware.
 * Formats errors and returns them as a consistent JSON payload, sanitizing sensitive details.
 */
const errorHandler = (err, req, res, next) => {
    // Log the error details to the console for server debugging
    console.error(err.stack || err);

    let statusCode = err.status || err.statusCode || 500;
    let message = err.message || 'Internal Server Error';

    // If it is a generic system/programming error, sanitize the message to prevent leaking internals
    if (statusCode === 500 && !err.isOperational) {
        message = 'Internal Server Error';
    }

    // Proactive safety: Redact any API key details from error messages
    if (typeof message === 'string') {
        message = message.replace(/apiKey=[a-zA-Z0-9\-]+/gi, 'apiKey=[REDACTED]');
        message = message.replace(/api\-key=[a-zA-Z0-9\-]+/gi, 'api-key=[REDACTED]');
    }

    res.status(statusCode).json({
        error: {
            message: message,
            status: statusCode
        }
    });
};

module.exports = errorHandler;
