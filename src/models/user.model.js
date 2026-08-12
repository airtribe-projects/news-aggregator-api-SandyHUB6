/**
 * In-memory collection for user database simulation.
 */
const users = [];

/**
 * User model representing a registered account.
 */
class UserModel {
    constructor(id, name, email, password, preferences = []) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.password = password; // Expecting hashed password
        this.preferences = preferences;
    }

    /**
     * Find a user by their email address (case-insensitive).
     * @param {string} email 
     * @returns {UserModel|undefined}
     */
    static findByEmail(email) {
        if (!email) return undefined;
        return users.find(u => u.email.toLowerCase() === email.toLowerCase());
    }

    /**
     * Find a user by their unique ID.
     * @param {string} id 
     * @returns {UserModel|undefined}
     */
    static findById(id) {
        if (!id) return undefined;
        return users.find(u => u.id === id);
    }

    /**
     * Store the user in our in-memory simulated database.
     * @param {UserModel} user 
     * @returns {UserModel}
     */
    static save(user) {
        users.push(user);
        return user;
    }

    /**
     * Retrieve all users.
     * @returns {UserModel[]}
     */
    static getAll() {
        return users;
    }

    /**
     * Clear all users from the memory store (primarily for unit test isolations).
     */
    static clearAll() {
        users.length = 0;
    }
}

module.exports = UserModel;
