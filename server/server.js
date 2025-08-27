
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs'); // Added fs module
const connectDB = require('./config/database');

// Route imports
const orderRoutes = require('./routes/orders');
const menuRoutes = require('./routes/menu');
const upiRoutes = require('./routes/upi');

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to database
connectDB();

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// In production, serve static files from the frontend build

  const frontendPath = path.join(__dirname, '../app/.next');
  
  // Serve static assets from Next.js build
  app.use('/_next', express.static(path.join(frontendPath, 'static')));
  
  // Handle all other requests by serving the appropriate HTML file
  app.get('*', (req, res) => {
    const basePath = path.join(frontendPath, 'server/app');
    let filePath;
    
    // Handle root path
    if (req.path === '/') {
      filePath = path.join(basePath, 'page.html');
    } 
    // Handle nested paths like /dashboard
    else {
      filePath = path.join(basePath, req.path, 'page.html');
    }
    
    // Fallback to index.html if specific file doesn't exist
    if (!fs.existsSync(filePath)) {
      filePath = path.join(basePath, 'page.html');
    }
    
    // Final fallback - return 404 if no file exists
    if (!fs.existsSync(filePath)) {
      return res.status(404).send('Page not found');
    }
    
    res.sendFile(filePath);
  });


// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.originalUrl}`);
  next();
});

// API Routes
app.use('/api/orders', orderRoutes);
app.use('/api/menu', menuRoutes);
app.use('/api/upi', upiRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'Server is running', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Handle undefined API routes
app.use('/api/*', (req, res) => {
  res.status(404).json({ 
    error: 'API endpoint not found',
    path: req.originalUrl,
    method: req.method
  });
});

// Global error handler
app.use((error, req, res, next) => {
  console.error('Server error:', error);
  res.status(500).json({ 
    error: 'Internal server error',
    message: error.message 
  });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});
