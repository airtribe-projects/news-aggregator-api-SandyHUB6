/**
 * GET /health controller
 * Returns status indicating the API is running successfully.
 */
const getHealth = (req, res) => {
    res.status(200).json({
        status: 'success',
        message: 'API is running and healthy'
    });
};

module.exports = {
    getHealth
};
