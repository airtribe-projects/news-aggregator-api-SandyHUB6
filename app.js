const express = require('express');
const app = express();

// Import routes and middleware
const healthRoutes = require('./src/routes/health.routes');
const userRoutes = require('./src/routes/user.routes');
const newsRoutes = require('./src/routes/news.routes');
const notFoundHandler = require('./src/middleware/notFound.middleware');
const errorHandler = require('./src/middleware/error.middleware');

// Built-in body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API routes
app.use('/', healthRoutes);
app.use('/users', userRoutes);
app.use('/news', newsRoutes);

// 404 Handler for unknown routes (placed after routes)
app.use(notFoundHandler);

// Centralized Error-Handling Middleware (placed last)
app.use(errorHandler);

module.exports = app;