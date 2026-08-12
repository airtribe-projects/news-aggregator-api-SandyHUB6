const { verifyToken } = require('../utils/jwt.util');
const UserModel = require('../models/user.model');

/**
 * Authentication middleware to protect API endpoints.
 * Extracts the JWT token from the Authorization header and verifies it.
 */
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];

    // Expect "Bearer <token>" format
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
            error: {
                message: 'Access denied. Missing or malformed authorization header.',
                status: 401
            }
        });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = verifyToken(token);

        // Verify that the user still exists in our memory database
        const user = UserModel.findByEmail(decoded.email);
        if (!user) {
            return res.status(401).json({
                error: {
                    message: 'Access denied. User no longer exists.',
                    status: 401
                }
            });
        }

        // Attach safe user identity to req.user context
        req.user = {
            id: user.id,
            name: user.name,
            email: user.email,
            preferences: user.preferences
        };

        next();
    } catch (err) {
        return res.status(401).json({
            error: {
                message: 'Access denied. Invalid or expired token.',
                status: 401
            }
        });
    }
};

module.exports = authenticateToken;
