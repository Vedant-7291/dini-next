// server/server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/database');

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to database
connectDB();

// Middleware - Allow requests from Next.js frontend during development
app.use(cors({
  origin: [
    'http://localhost:3000', // Next.js dev server
    'http://127.0.0.1:3000'  // Alternative localhost
  ],
  credentials: true
}));

app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Your existing routes
app.use('/api/orders', require('./routes/orders'));
app.use('/api/menu', require('./routes/menu'));
app.use('/api/upi', require('./routes/upi'));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'Express server is running',
    port: PORT,
    timestamp: new Date().toISOString()
  });
});

// Test endpoint to verify rewrites are working
app.get('/api/test-rewrite', (req, res) => {
  res.json({ 
    message: 'This came from Express server!',
    server: 'Express on port 5000',
    requestedFrom: req.get('host')
  });
});

app.listen(PORT, () => {
  console.log(`✅ Express server running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
});
