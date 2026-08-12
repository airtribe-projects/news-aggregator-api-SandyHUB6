const bcrypt = require('bcryptjs');
const UserModel = require('../models/user.model');
const { signToken } = require('../utils/jwt.util');

/**
 * User service handles business logic for user operations.
 */
class UserService {
    /**
     * Creates and registers a new user in the in-memory database.
     * @param {Object} userData 
     * @param {string} userData.name
     * @param {string} userData.email
     * @param {string} userData.password
     * @param {Array<string>} [userData.preferences]
     * @returns {Promise<Object>} Safe user representation (without password hash)
     */
    async createUser(userData) {
        const { name, email, password, preferences } = userData || {};

        // 1. Validate required fields
        if (!name || !email || !password) {
            const error = new Error('Name, email, and password are required fields.');
            error.statusCode = 400;
            throw error;
        }

        // Basic check for valid email syntax
        if (typeof email !== 'string' || !email.includes('@')) {
            const error = new Error('A valid email address is required.');
            error.statusCode = 400;
            throw error;
        }

        // 2. Validate email uniqueness
        const existingUser = UserModel.findByEmail(email);
        if (existingUser) {
            const error = new Error('User already exists with this email address.');
            error.statusCode = 400;
            throw error;
        }

        // 3. Hash password using bcryptjs
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // 4. Generate user ID
        const userId = 'usr_' + Date.now() + Math.random().toString(36).substring(2, 7);

        // 5. Create user model instance and save
        const newUser = new UserModel(
            userId,
            name.trim(),
            email.trim().toLowerCase(),
            hashedPassword,
            preferences || []
        );
        UserModel.save(newUser);

        // 6. Return safe representation (excluding password hash)
        return {
            id: newUser.id,
            name: newUser.name,
            email: newUser.email,
            preferences: newUser.preferences
        };
    }

    /**
     * Authenticates a user and generates a JWT.
     * @param {string} email 
     * @param {string} password 
     * @returns {Promise<string>} JWT token on success
     */
    async authenticateUser(email, password) {
        // Validate required inputs
        if (!email || !password) {
            const error = new Error('Email and password are required fields.');
            error.statusCode = 400;
            throw error;
        }

        // Find user by email
        const user = UserModel.findByEmail(email);
        if (!user) {
            const error = new Error('Invalid email or password.');
            error.statusCode = 401; // Unauthorized
            throw error;
        }

        // Compare password hash
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            const error = new Error('Invalid email or password.');
            error.statusCode = 401; // Unauthorized
            throw error;
        }

        // Sign and return JWT
        const tokenPayload = {
            id: user.id,
            email: user.email
        };

        return signToken(tokenPayload);
    }

    /**
     * Retrieves preferences of the user.
     * @param {string} userId 
     * @returns {Promise<Array<string>>}
     */
    async getPreferences(userId) {
        if (!userId) {
            const error = new Error('User ID is required.');
            error.statusCode = 400;
            throw error;
        }

        const user = UserModel.findById(userId);
        if (!user) {
            const error = new Error('User not found.');
            error.statusCode = 404;
            throw error;
        }

        return user.preferences;
    }

    /**
     * Updates preferences of the user.
     * @param {string} userId 
     * @param {Array<string>} preferences 
     * @returns {Promise<Array<string>>}
     */
    async updatePreferences(userId, preferences) {
        if (!userId) {
            const error = new Error('User ID is required.');
            error.statusCode = 400;
            throw error;
        }

        // Validate preferences is an array
        if (!Array.isArray(preferences)) {
            const error = new Error('Preferences must be an array.');
            error.statusCode = 400;
            throw error;
        }

        const user = UserModel.findById(userId);
        if (!user) {
            const error = new Error('User not found.');
            error.statusCode = 404;
            throw error;
        }

        // Update user preferences in place
        user.preferences = preferences;
        return user.preferences;
    }
}

module.exports = new UserService();
