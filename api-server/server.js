// server.js

const express = require('express');
const https = require('https');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
require('dotenv').config();

// Initialize MongoDB connection
require('./database');

const app = express();

// Routers
const transactionsRouter = require('./routes/transactions');
const usersRouter = require('./routes/users');

// Security & custom middleware
const { 
  paymentLimiter, 
  historyLimiter, 
  employeeLimiter,
  sanitizeInput, 
  csrfProtection, 
  requestLogger, 
  securityHeaders 
} = require('./middleware/security');


// Security Middlewares

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  }
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/', limiter);

// CORS configuration
app.use(cors({
  origin: ['https://localhost:3000', 'http://localhost:3000'],
  credentials: true,
  methods: ['GET','POST','PUT','PATCH','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
}));

// Cookie parser (required before routes)
app.use(cookieParser(process.env.COOKIE_SECRET || 'dev_cookie_secret'));

// Custom security middleware
app.use(securityHeaders);
app.use(requestLogger);
app.use(sanitizeInput);
app.use(csrfProtection);

// Logging requests
app.use(morgan('combined'));

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));


// Routes

app.use('/transactions', employeeLimiter, transactionsRouter);
app.use('/users', usersRouter);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});


// Error Handling

app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ 
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});


// HTTPS / HTTP Setup

const PORT = process.env.PORT || 4000;

const sslKeyPath = path.join(__dirname, 'ssl', 'key.pem');
const sslCertPath = path.join(__dirname, 'ssl', 'cert.pem');

if (fs.existsSync(sslKeyPath) && fs.existsSync(sslCertPath)) {
  const httpsOptions = {
    key: fs.readFileSync(sslKeyPath),
    cert: fs.readFileSync(sslCertPath),
    minVersion: 'TLSv1.3',
    maxVersion: 'TLSv1.3',
    ciphers: [
      'TLS_AES_256_GCM_SHA384',
      'TLS_CHACHA20_POLY1305_SHA256',
      'TLS_AES_128_GCM_SHA256'
    ].join(':'),
    honorCipherOrder: true
  };

  https.createServer(httpsOptions, app).listen(PORT, () => {
    console.log(`✓ Secure HTTPS server running on port ${PORT}`);
    console.log(`✓ TLS 1.3 enabled`);
    console.log(`✓ HTTPOnly and SameSite cookies enabled`);
    console.log(`  Health check: https://localhost:${PORT}/health`);
    console.log(`  Note: Self-signed certificate - browser will show security warning`);
  });
} else {
  console.warn('⚠ SSL certificates not found. Running in HTTP mode.');
  app.listen(PORT, () => {
    console.log(`Server running on HTTP port ${PORT} (INSECURE)`);
    console.log(`Health check: http://localhost:${PORT}/health`);
  });
}
