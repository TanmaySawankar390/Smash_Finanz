const express = require('express');
const cors = require('cors');
const { json, urlencoded } = require('express');
const mongoose = require('mongoose');

// Initialize express app
const app = express();

// Middleware
app.use(cors());
app.use(json());
app.use(urlencoded({ extended: true }));

// Auth middleware
// const authMiddleware = require('./middleware/auth');
// app.use(authMiddleware);

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date(),
    uptime: process.uptime()
  });
});

// API routes
app.use('/api/users', require('./routes/users'));
app.use('/api/transactions', require('./routes/transactions'));
app.use('/api/spendings', require('./routes/spendings'));
app.use('/api/chat', require('./routes/chatHistory'));

// API documentation endpoint
app.get('/api-docs', (req, res) => {
  res.json({
    message: 'API documentation will be available here',
    version: '1.0.0',
    endpoints: {
      users: [
        { path: '/api/users', methods: ['POST'], description: 'Create new user' },
        { path: '/api/users/profile', methods: ['GET'], description: 'Get user profile' }
      ],
      transactions: [
        { path: '/api/transactions', methods: ['POST', 'GET'], description: 'Create/Get transactions' },
        { path: '/api/transactions/monthly-summary', methods: ['GET'], description: 'Get monthly summary' }
      ],
      spendings: [
        { path: '/api/spendings/category-total/:categoryId', methods: ['GET'], description: 'Get category total' },
        { path: '/api/spendings/trends', methods: ['GET'], description: 'Get spending trends' }
      ]
    }
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Route ${req.method} ${req.path} not found`
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  
  if (err.name === 'UnauthorizedError') {
    return res.status(401).json({ error: 'Invalid token' });
  }

  if (err.name === 'ValidationError') {
    return res.status(400).json({
      error: 'Validation Error',
      details: Object.values(err.errors).map(e => e.message)
    });
  }

  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

module.exports = app;
