const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(helmet());
app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://valorant-finder-app.vercel.app',
    'https://valorant-finder.com',
    /.*\.vercel\.app$/
  ],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Import routes
let valorantRoutes;
try {
  valorantRoutes = require('./routes/valorant');
  console.log('✅ Valorant routes loaded successfully');
} catch (error) {
  console.error('❌ Error loading valorant routes:', error);
  // Create a fallback router
  valorantRoutes = require('express').Router();
  valorantRoutes.get('/error', (req, res) => {
    res.json({ error: 'Routes failed to load', details: error.message });
  });
}

// Debug logging
console.log('🔍 Loading routes...');
console.log('📁 Routes directory exists:', require('fs').existsSync('./routes'));
console.log('📄 Valorant routes file exists:', require('fs').existsSync('./routes/valorant.js'));

// Routes
app.use('/api/valorant', valorantRoutes);
console.log('✅ Valorant routes loaded at /api/valorant');

// Test route to verify routing
app.get('/api/test', (req, res) => {
  res.json({ message: 'API routing is working!', timestamp: new Date().toISOString() });
});

// Simple test route before valorant routes
app.get('/api/simple', (req, res) => {
  res.json({ message: 'Simple API route works!', timestamp: new Date().toISOString() });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Valorant Finder Backend API',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      validateProfile: '/api/valorant/validate-profile'
    }
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Endpoint not found',
    message: `Cannot ${req.method} ${req.originalUrl}`
  });
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Error:', error);
  res.status(500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Valorant Finder Backend running on port ${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/health`);
}); 