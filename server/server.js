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
// Vercel manages the port internally, so PORT variable is less critical here for deployment
// const PORT = process.env.PORT || 5001; // Not needed for Vercel's direct app export

// Environment logging (good for debugging Vercel logs)
console.log('Environment:', {
  NODE_ENV: process.env.NODE_ENV,
  PORT: process.env.PORT, // This will be set by Vercel
  MONGODB_URI: process.env.MONGODB_URI ? '[SET]' : '[NOT SET]',
  JWT_SECRET: process.env.JWT_SECRET ? '[SET]' : '[NOT SET]',
  JWT_EXPIRE: process.env.JWT_EXPIRE,
  CORS_ORIGIN: process.env.CORS_ORIGIN
});

// CORS config
const corsOptions = {
  origin: process.env.CORS_ORIGIN || ['https://www.memoryblock.org', 'https://memoryblock.org', 'http://localhost:3000', 'http://localhost:5173'],
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
  console.log('Headers:', req.headers);
  console.log('Body:', req.body);
  next();
});

// CORS fallback headers (ensure these are set before routes)
app.use((req, res, next) => {
  const allowedOrigins = process.env.CORS_ORIGIN ? 
    (Array.isArray(process.env.CORS_ORIGIN) ? process.env.CORS_ORIGIN : [process.env.CORS_ORIGIN]) : 
    ['https://www.memoryblock.org', 'https://memoryblock.org', 'http://localhost:3000', 'http://localhost:5173'];
  
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
  }
  
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Credentials', true);

  if (req.method === 'OPTIONS') return res.sendStatus(200);
  next();
});

// --- MongoDB connect (This will run when server.js is imported/built by Vercel) ---
if (!process.env.MONGODB_URI) {
  console.error('❌ MONGODB_URI is not set!');
  // On Vercel, this might just crash the build or cold start, but doesn't halt the process.
  // Consider a more graceful error handling for production if no URI.
} else {
  mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 30000, // Increased from 5000ms
    socketTimeoutMS: 45000,
    connectTimeoutMS: 60000,
    bufferCommands: false, // Disable mongoose buffering
    maxPoolSize: 10, // Maintain up to 10 socket connections
    retryWrites: true,
    w: 'majority'
  })
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => {
    console.error('❌ MongoDB connection failed:', err.message);
    console.error(err.stack);
    // Vercel will log this error and might mark the deployment as failed on subsequent requests.
  });
}

// Setup routes *after* connection logic (synchronously for Vercel export)
// These routes are attached to 'app' immediately when server.js is processed
app.use('/api/auth', authRoutes);
app.use('/api/memories', memoryRoutes);
app.use('/api/user', userRoutes);

// Add explicit auth routes for debugging
app.use('/auth', authRoutes);
app.use('/memories', memoryRoutes);
app.use('/user', userRoutes);

// Health check
app.get('/api/health', async (req, res) => {
  const mongoState = mongoose.connection.readyState;
  const mongoStateText = ['disconnected', 'connected', 'connecting', 'disconnecting'][mongoState] || 'unknown';

  let dbTest = null;
  try {
    if (mongoState === 1) {
      // Test actual database operation
      await mongoose.connection.db.admin().ping();
      dbTest = 'Database ping successful';
    }
  } catch (error) {
    dbTest = `Database ping failed: ${error.message}`;
  }

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
      uri: process.env.MONGODB_URI ? 'Set (hidden)' : 'Not set',
      test: dbTest
    }
  });
});

app.get('/', (req, res) => {
  res.json({
    message: 'Memory Blocks API',
    docs: '/api/health',
    availableRoutes: ['/api/auth/register', '/api/auth/login', '/api/health']
  });
});

// Test route
app.get('/test', (req, res) => {
  res.json({ message: 'Server is working!' });
});

app.post('/api/test', (req, res) => {
  res.json({ message: 'POST endpoint working!', body: req.body });
});

// Error handling middleware (keep at the end)
app.use('*', (req, res) => {
  console.log(`404 - Not Found: ${req.originalUrl}`);
  res.status(404).json({ message: 'Endpoint not found' });
});

app.use((err, req, res, next) => {
  console.error('Server error:', err.message);
  console.error('Server error stack:', err.stack);
  res.status(500).json({ message: 'Internal server error', error: err.message });
});

// THIS IS THE CRUCIAL PART FOR VERCEL
// Export the app instance directly. Vercel's runtime will handle listening.
module.exports = app;