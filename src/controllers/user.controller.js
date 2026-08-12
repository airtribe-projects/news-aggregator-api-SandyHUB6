const userService = require('../services/user.service');

/**
 * User controller.
 * Handles HTTP requests for user endpoints.
 */

/**
 * Handle POST /users/signup
 */
const signup = async (req, res, next) => {
    try {
        const user = await userService.createUser(req.body);
        return res.status(200).json(user);
    } catch (err) {
        next(err);
    }
};

/**
 * Handle POST /users/login
 */
const login = async (req, res, next) => {
    try {
        const { email, password } = req.body || {};
        
        // Validation check
        if (!email || !password) {
            const error = new Error('Email and password are required fields.');
            error.statusCode = 400;
            throw error;
        }

        const token = await userService.authenticateUser(email, password);
        return res.status(200).json({ token });
    } catch (err) {
        next(err);
    }
};

/**
 * Handle GET /users/preferences (Stub)
 */
const getPreferences = (req, res, next) => {
    return res.status(501).json({
        error: {
            message: 'Get user preferences is not implemented yet.',
            status: 501
        }
    });
};

/**
 * Handle PUT /users/preferences (Stub)
 */
const updatePreferences = (req, res, next) => {
    return res.status(501).json({
        error: {
            message: 'Update user preferences is not implemented yet.',
            status: 501
        }
    });
};

module.exports = {
    signup,
    login,
    getPreferences,
    updatePreferences
};
