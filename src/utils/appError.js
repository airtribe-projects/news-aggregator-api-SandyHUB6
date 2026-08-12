/**
 * Custom AppError class to represent operational errors with HTTP status codes.
 */
class AppError extends Error {
    /**
     * @param {string} message - Error description message.
     * @param {number} statusCode - HTTP status code matching the error.
     */
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode || 500;
        this.isOperational = true; // Identifies operational errors from system bugs

        Error.captureStackTrace(this, this.constructor);
    }
}

module.exports = AppError;
