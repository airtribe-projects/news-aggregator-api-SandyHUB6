/**
 * JWT Configuration.
 * Loads variables from the environment with development-safe fallbacks.
 */
module.exports = {
    jwtSecret: process.env.JWT_SECRET || 'dev_secret_key_news_aggregator_api_12345',
    jwtExpiresIn: process.env.JWT_EXPIRY || '24h'
};
