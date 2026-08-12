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
 * Handle GET /users/preferences
 */
const getPreferences = async (req, res, next) => {
    try {
        const preferences = await userService.getPreferences(req.user.id);
        return res.status(200).json({ preferences });
    } catch (err) {
        next(err);
    }
};

/**
 * Handle PUT /users/preferences
 */
const updatePreferences = async (req, res, next) => {
    try {
        const { preferences } = req.body || {};
        const updatedPreferences = await userService.updatePreferences(req.user.id, preferences);
        return res.status(200).json({ preferences: updatedPreferences });
    } catch (err) {
        next(err);
    }
};

module.exports = {
    signup,
    login,
    getPreferences,
    updatePreferences
};
