require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');

const app = express();

// ✅ REMOVED debugLog function - use console instead
// If you need debug logging later, use: console.log(), console.error(), etc.

// ✅ CORS Configuration - Set BEFORE all routes
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'http://127.0.0.1:5173',
  'https://shri-amarnath-janshakti-website.onrender.com',
  /\.netlify\.app$/,
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

// ✅ REMOVED debug logging middleware

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

// ✅ API 404 handler
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
  console.error('🔴 Unhandled error:', err.message || err);
  const status = err.status || err.statusCode || 500;
  res.status(status).json({
    success: false,
    message: err.message || 'Internal server error',
  });
});

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📍 API Base URL: http://localhost:${PORT}/api`);
    });
  } catch (err) {
    console.error('❌ Failed to start server:', err.message);
    process.exitCode = 1;
  }
};

startServer();