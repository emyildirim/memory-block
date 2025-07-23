require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');

// Import routes
const authRoutes = require('./routes/authRoutes');
const memoryRoutes = require('./routes/memoryRoutes');
const userRoutes = require('./routes/userRoutes');

const app = express();
const PORT = process.env.PORT || 5001;

// Log environment variables (without sensitive data)
console.log('Environment:', {
  NODE_ENV: process.env.NODE_ENV,
  PORT: process.env.PORT,
  MONGODB_URI: process.env.MONGODB_URI ? '[SET]' : '[NOT SET]',
  JWT_SECRET: process.env.JWT_SECRET ? '[SET]' : '[NOT SET]',
  JWT_EXPIRE: process.env.JWT_EXPIRE,
  CORS_ORIGIN: process.env.CORS_ORIGIN
});

// CORS configuration
const corsOptions = {
  origin: process.env.CORS_ORIGIN || 'https://www.memoryblock.org',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  optionsSuccessStatus: 200
};

// Log CORS settings on startup
console.log('CORS settings:', {
  origin: process.env.CORS_ORIGIN || 'https://www.memoryblock.org',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
});

// Middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' }
}));
app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.originalUrl}`);
  next();
});

// Add CORS headers manually as backup
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', process.env.CORS_ORIGIN || 'https://www.memoryblock.org');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Credentials', true);
  
  // Handle OPTIONS method
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  next();
});

// MongoDB connection with detailed logging
console.log('Attempting MongoDB connection...');
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/memory-blocks', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('Connected to MongoDB successfully');
  console.log('MongoDB connection state:', mongoose.connection.readyState);
})
.catch(err => {
  console.error('MongoDB connection error details:', err.message);
  console.error('MongoDB connection error stack:', err.stack);
  
  // Check for common MongoDB connection errors
  if (err.name === 'MongoServerSelectionError') {
    console.error('MongoDB server selection error - check your connection string and network');
  }
  
  if (err.name === 'MongoNetworkError') {
    console.error('MongoDB network error - check your network connection and MongoDB server');
  }
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/memories', memoryRoutes);
app.use('/api/user', userRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    message: 'Memory Blocks API is running', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    cors: {
      origin: process.env.CORS_ORIGIN || 'https://www.memoryblock.org'
    },
    mongodb: {
      connected: mongoose.connection.readyState === 1,
      state: mongoose.connection.readyState
    }
  });
});

// Root endpoint for Vercel
app.get('/', (req, res) => {
  res.json({ 
    message: 'Memory Blocks API',
    docs: '/api/health'
  });
});

// 404 handler
app.use('*', (req, res) => {
  console.log(`404 - Not Found: ${req.originalUrl}`);
  res.status(404).json({ message: 'Endpoint not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Server error:', err.message);
  console.error('Server error stack:', err.stack);
  res.status(500).json({ message: 'Internal server error', error: err.message });
});

// Start server if not being imported
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`CORS origin: ${process.env.CORS_ORIGIN || 'https://www.memoryblock.org'}`);
  });
}

// Export for serverless functions
module.exports = app; 