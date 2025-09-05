require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const compression = require('compression');
const morgan = require('morgan');

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

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 auth requests per windowMs
  message: 'Too many authentication attempts, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

// Middlewares
app.use(compression()); // Enable gzip compression
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'"],
      fontSrc: ["'self'"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'none'"],
    },
  },
}));

// Apply rate limiting
app.use('/api/auth', authLimiter);
app.use('/api', limiter);

app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(mongoSanitize()); // Prevent NoSQL injection attacks

// Logging middleware (only in production)
if (process.env.NODE_ENV === 'production') {
  app.use(morgan('combined'));
} else {
  app.use(morgan('dev'));
}

// Custom request logger (only in development, morgan handles production)
if (process.env.NODE_ENV !== 'production') {
  app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.originalUrl}`);
    if (req.body && Object.keys(req.body).length > 0) {
      console.log('Body:', req.body);
    }
    next();
  });
}

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

// --- MongoDB connect (Optimized for Vercel serverless) ---
let isConnected = false;

const connectDB = async () => {
  if (isConnected) {
    console.log('✅ Using existing MongoDB connection');
    return;
  }

  if (!process.env.MONGODB_URI) {
    console.error('❌ MONGODB_URI is not set!');
    throw new Error('MONGODB_URI environment variable is required');
  }

  try {
    console.log('🔄 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000, // Reduced for faster serverless startup
      socketTimeoutMS: 45000,
      connectTimeoutMS: 10000, // Reduced for serverless
      bufferCommands: false, // Disable mongoose buffering
      maxPoolSize: 1, // Reduced for serverless - single connection
      retryWrites: true,
      w: 'majority'
    });
    
    isConnected = true;
    console.log('✅ MongoDB connected successfully');
  } catch (err) {
    console.error('❌ MongoDB connection failed:', err.message);
    console.error('Full error:', err);
    throw err;
  }
};

// Initialize connection (but don't block app startup)
connectDB().catch(err => {
  console.error('❌ Initial MongoDB connection failed:', err.message);
});

// Handle connection events
mongoose.connection.on('connected', () => {
  isConnected = true;
  console.log('✅ Mongoose connected to MongoDB');
});

mongoose.connection.on('error', (err) => {
  isConnected = false;
  console.error('❌ Mongoose connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  isConnected = false;
  console.log('⚠️ Mongoose disconnected');
});

// Middleware to ensure DB connection before handling requests
app.use(async (req, res, next) => {
  if (!isConnected && mongoose.connection.readyState !== 1) {
    try {
      await connectDB();
    } catch (error) {
      console.error('❌ Database connection failed on request:', error.message);
      return res.status(500).json({ 
        error: 'Database connection failed', 
        message: 'Please try again in a moment'
      });
    }
  }
  next();
});

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
    // Ensure connection before testing
    if (!isConnected && mongoState !== 1) {
      await connectDB();
    }
    
    if (mongoose.connection.readyState === 1) {
      // Test actual database operation
      await mongoose.connection.db.admin().ping();
      dbTest = 'Database ping successful';
    } else {
      dbTest = 'Database not connected';
    }
  } catch (error) {
    dbTest = `Database ping failed: ${error.message}`;
  }

  res.json({
    message: 'Memory Blocks API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    vercel: !!process.env.VERCEL,
    cors: {
      origin: process.env.CORS_ORIGIN || 'https://www.memoryblock.org'
    },
    mongodb: {
      connected: mongoState === 1 && isConnected,
      state: mongoState,
      stateText: mongoStateText,
      isConnectedFlag: isConnected,
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