// Security middleware for additional protection

const rateLimit = require('express-rate-limit');

// Payment-specific rate limiting (more restrictive)
const paymentLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // limit each IP to 10 payment requests per windowMs
  message: {
    error: 'Too many payment requests from this IP, please try again later.',
    retryAfter: Math.ceil(15 * 60 * 1000 / 1000) // seconds
  },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true, // Don't count successful requests
});

// Transaction history rate limiting
const historyLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 20, // limit each IP to 20 history requests per windowMs
  message: {
    error: 'Too many history requests from this IP, please try again later.',
    retryAfter: Math.ceil(5 * 60 * 1000 / 1000)
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Transaction operations rate limiting (more lenient for admin tasks)
const transactionLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 transaction operations per windowMs
  message: {
    error: 'Too many transaction operations from this IP, please try again later.',
    retryAfter: Math.ceil(15 * 60 * 1000 / 1000)
  },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true, // Don't count successful requests
});

// Input sanitization middleware
const sanitizeInput = (req, res, next) => {
  // Remove potentially dangerous characters from string inputs
  const sanitizeString = (str) => {
    if (typeof str !== 'string') return str;
    return str
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Remove script tags
      .replace(/javascript:/gi, '') // Remove javascript: protocol
      .replace(/on\w+\s*=/gi, '') // Remove event handlers
      .trim();
  };

  // Sanitize body parameters
  if (req.body) {
    Object.keys(req.body).forEach(key => {
      if (typeof req.body[key] === 'string') {
        req.body[key] = sanitizeString(req.body[key]);
      }
    });
  }

  // Sanitize query parameters
  if (req.query) {
    Object.keys(req.query).forEach(key => {
      if (typeof req.query[key] === 'string') {
        req.query[key] = sanitizeString(req.query[key]);
      }
    });
  }

  next();
};

// CSRF protection 
const csrfProtection = (req, res, next) => {
  const skipRoutes = ['/health', '/transactions', '/users'];
  const shouldSkip = req.method === 'GET' || req.method === 'HEAD' || req.method === 'OPTIONS' || 
                    skipRoutes.some(route => req.path.startsWith(route));
  
  if (shouldSkip) {
    return next();
  }
  
  if (!req.headers['x-requested-with']) {
    return res.status(403).json({
      error: 'CSRF protection: X-Requested-With header required'
    });
  }
  next();
};

// Request logging middleware
const requestLogger = (req, res, next) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    const logData = {
      method: req.method,
      url: req.url,
      status: res.statusCode,
      duration: `${duration}ms`,
      ip: req.ip || req.connection.remoteAddress,
      userAgent: req.get('User-Agent'),
      timestamp: new Date().toISOString()
    };
    
    // Log sensitive operations
    if (req.url.includes('/transactions') && req.method === 'POST') {
      console.log('PAYMENT_REQUEST:', JSON.stringify(logData));
    } else {
      console.log('API_REQUEST:', JSON.stringify(logData));
    }
  });
  
  next();
};

// Security headers middleware
const securityHeaders = (req, res, next) => {
  // Additional security headers
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');
  
  next();
};

module.exports = {
  paymentLimiter,
  historyLimiter,
  transactionLimiter,
  sanitizeInput,
  csrfProtection,
  requestLogger,
  securityHeaders
};
