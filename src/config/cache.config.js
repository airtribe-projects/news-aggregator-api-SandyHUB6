/**
 * Cache Configuration settings.
 * Parses NEWS_CACHE_TTL from the environment variables, falling back to 300 seconds (5 minutes).
 */
module.exports = {
    cacheTtl: parseInt(process.env.NEWS_CACHE_TTL, 10) || 300
};
