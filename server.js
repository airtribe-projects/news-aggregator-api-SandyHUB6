const app = require('./app');

// Read PORT from environment variables or fall back to 3000
const PORT = process.env.PORT || 3000;

// Start the server and listen for incoming HTTP connections
const server = app.listen(PORT, (err) => {
    if (err) {
        console.error('Error starting the server:', err);
        process.exit(1);
    }
    console.log(`Server is listening on port ${PORT}`);
});

module.exports = server;
