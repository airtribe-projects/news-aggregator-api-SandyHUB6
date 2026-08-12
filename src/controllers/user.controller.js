/**
 * User controller (Stub).
 * Handles signup, login, and user preference endpoints.
 */

const signup = (req, res, next) => {
    return res.status(501).json({
        error: {
            message: 'User signup is not implemented yet.',
            status: 501
        }
    });
};

const login = (req, res, next) => {
    return res.status(501).json({
        error: {
            message: 'User login is not implemented yet.',
            status: 501
        }
    });
};

const getPreferences = (req, res, next) => {
    return res.status(501).json({
        error: {
            message: 'Get user preferences is not implemented yet.',
            status: 501
        }
    });
};

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
