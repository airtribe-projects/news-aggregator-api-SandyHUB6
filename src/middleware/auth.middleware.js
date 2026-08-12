/**
 * Authentication middleware (Stub).
 * Will be implemented in the authentication/JWT step.
 */
const authenticateToken = (req, res, next) => {
    return res.status(501).json({
        error: {
            message: 'Authentication middleware is not implemented yet.',
            status: 501
        }
    });
};

module.exports = authenticateToken;
