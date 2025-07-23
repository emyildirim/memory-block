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

// Environment logging
console.log('Environment:', {
  NODE_ENV: process.env.NODE_ENV,
  PORT: process.env.PORT,
  MONGODB_URI: process.env.MONGODB_URI ? '[SET]' : '[NOT SET]',
  JWT_SECRET: process.env.JWT_SECRET ? '[SET]' : '[NOT SET]',
  JWT_EXPIRE: process.env.JWT_EXPIRE,
  CORS_ORIGIN: process.env.CORS_ORIGIN
});

// CORS config
const corsOptions = {
  origin: process.env.CORS_ORIGIN || 'https://www.memoryblock.org',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  optionsSuccessStatus: 200
};

// Middlewares
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' }
}));
app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Request logger
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.originalUrl}`);
  next();
});

// CORS fallback headers
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', process.env.CORS_ORIGIN || 'https://www.memoryblock.org');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Credentials', true);
  
  if (req.method === 'OPTIONS') return res.sendStatus(200);
  next();
});

// --- MongoDB connect then start app ---
async function startServer() {
  if (!process.env.MONGODB_URI) {
    console.error('❌ MONGODB_URI is not set!');
    process.exit(1);
  }

  try {
    console.log('Attempting MongoDB connection...');
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000
    });

    console.log('✅ MongoDB connected');
    console.log('MongoDB connection state:', mongoose.connection.readyState);

    // Setup routes *after* connection
    app.use('/api/auth', authRoutes);
    app.use('/api/memories', memoryRoutes);
    app.use('/api/user', userRoutes);

    // Health check
    app.get('/api/health', (req, res) => {
      const mongoState = mongoose.connection.readyState;
      const mongoStateText = ['disconnected', 'connected', 'connecting', 'disconnecting'][mongoState] || 'unknown';
      
      res.json({
        message: 'Memory Blocks API is running',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development',
        cors: {
          origin: process.env.CORS_ORIGIN || 'https://www.memoryblock.org'
        },
        mongodb: {
          connected: mongoState === 1,
          state: mongoState,
          stateText: mongoStateText,
          uri: process.env.MONGODB_URI ? 'Set (hidden)' : 'Not set'
        }
      });
    });

    app.get('/', (req, res) => {
      res.json({
        message: 'Memory Blocks API',
        docs: '/api/health'
      });
    });

    app.use('*', (req, res) => {
      console.log(`404 - Not Found: ${req.originalUrl}`);
      res.status(404).json({ message: 'Endpoint not found' });
    });

    app.use((err, req, res, next) => {
      console.error('Server error:', err.message);
      console.error('Server error stack:', err.stack);
      res.status(500).json({ message: 'Internal server error', error: err.message });
    });

    /*if (require.main === module) {
      app.listen(PORT, () => {
        console.log(`🚀 Server running on port ${PORT}`);
        console.log(`🌐 CORS origin: ${process.env.CORS_ORIGIN || 'https://www.memoryblock.org'}`);
      });
    }*/
  } catch (err) {
    console.error('❌ MongoDB connection failed:', err.message);
    console.error(err.stack);
    process.exit(1); // Exit if DB connection fails
  }
}

// Start it
startServer();

module.exports = app;