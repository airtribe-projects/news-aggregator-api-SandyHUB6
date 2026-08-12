/**
 * News API Configuration.
 * Loads external API credentials and URL settings from the environment.
 */
module.exports = {
    newsApiKey: process.env.NEWS_API_KEY,
    newsApiUrl: process.env.NEWS_API_URL || 'https://newsapi.org/v2/top-headlines'
};
