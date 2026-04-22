require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');
const connectDB = require('./config/db');

const app = express();

// ✅ Security Middleware - Helmet.js for security headers
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", 'data:', 'https:'],
    },
  },
  hsts: { maxAge: 31536000, includeSubDomains: true },
  frameguard: { action: 'deny' },
}));

// ✅ Rate Limiting
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 attempts per window
  message: 'Too many login attempts, please try again later',
  standardHeaders: true,
  legacyHeaders: false,
});

const apiLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 100, // 100 requests per minute
  message: 'Too many requests, please try again later',
});

const donationLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // 10 donations per hour (prevent spam)
  message: 'Too many donations, please try again later',
  skipSuccessfulRequests: true,
});

const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5001',
  'http://localhost:3000',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:5001',
  /\.netlify\.app$/,
  /\.vercel\.app$/,
];

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    const isAllowed = allowedOrigins.some((o) =>
      typeof o === 'string' ? o === origin : o.test(origin)
    );
    if (isAllowed) return callback(null, true);
    callback(new Error(`CORS: origin "${origin}" not allowed`));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// Serve uploads properly
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/contacts', require('./routes/contacts'));
app.use('/api/donations', require('./routes/donations'));
app.use('/api/gallery', require('./routes/gallery'));
app.use('/api/yatra', require('./routes/yatra'));
app.use('/api/ticker', require('./routes/ticker'));
app.use('/api/announcements', require('./routes/announcements'));
app.use('/api/settings', require('./routes/settings'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// ✅ API 404
app.use((req, res, next) => {
  if (req.path.startsWith('/api/')) {
    console.warn(`[404] API route not found: ${req.originalUrl}`);
    return res.status(404).json({ success: false, message: `API route not found: ${req.originalUrl}` });
  }
  next();
});

// Production - serve frontend static files
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '..', 'dist')));
  app.use((req, res) => {
    res.sendFile(path.join(__dirname, '..', 'dist', 'index.html'));
  });
}

// ✅ Global error handler
app.use((err, req, res, next) => {
  console.error('❌ Unhandled error:', {
    message: err.message || err,
    status: err.status || err.statusCode || 500,
    path: req.path,
    method: req.method,
    stack: err.stack,
  });

  const status = err.status || err.statusCode || 500;
  res.status(status).json({
    success: false,
    message: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
});

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    // Check for required environment variables
    const requiredEnvVars = ['MONGO_URI', 'JWT_SECRET'];
    const missingVars = requiredEnvVars.filter(v => !process.env[v]);

    if (missingVars.length > 0) {
      console.error(`❌ Missing required environment variables: ${missingVars.join(', ')}`);
      console.error('❌ Please create a .env file with all required variables.');
      console.error('📋 See .env.example for template');
      process.exitCode = 1;
      return;
    }

    await connectDB();
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📍 API Base URL: http://localhost:${PORT}/api`);
      console.log(`🔐 Auth middleware enabled for admin routes`);
    });
  } catch (err) {
    console.error('❌ Failed to start server:', err.message);
    console.error('❌ Stack:', err.stack);
    process.exitCode = 1;
  }
};

// ✅ Only start the server if not running as a Serverless Function
if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
  startServer();
}

module.exports = app;