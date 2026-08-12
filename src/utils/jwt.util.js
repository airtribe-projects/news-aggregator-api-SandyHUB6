const jwt = require('jsonwebtoken');
const { jwtSecret, jwtExpiresIn } = require('../config/jwt.config');

/**
 * Signs a new JSON Web Token.
 * @param {Object} payload - Identity information to include in the token payload.
 * @returns {string} The signed JWT.
 */
const signToken = (payload) => {
    return jwt.sign(payload, jwtSecret, { expiresIn: jwtExpiresIn });
};

/**
 * Verifies a JSON Web Token.
 * @param {string} token - The JWT string to verify.
 * @returns {Object} The decoded payload if valid.
 * @throws {Error} If verification fails.
 */
const verifyToken = (token) => {
    return jwt.verify(token, jwtSecret);
};

module.exports = {
    signToken,
    verifyToken
};
