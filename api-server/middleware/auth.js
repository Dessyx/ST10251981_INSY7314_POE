// Authentication middleware using HTTPOnly cookies
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret';

/**
 * Middleware to verify JWT token from HTTPOnly cookie
 * Protects routes that require authentication
 */
const verifyToken = (req, res, next) => {
  try {
    // Get token from cookie (not from Authorization header anymore)
    const token = req.cookies.authToken;

    if (!token) {
      return res.status(401).json({ 
        error: 'Authentication required',
        message: 'No authentication token found'
      });
    }

    // Verify the token
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Attach user info to request object
    req.user = {
      id: decoded.id,
      username: decoded.username,
      role: decoded.role || 'customer'
    };

    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      // Clear expired cookie
      res.clearCookie('authToken', {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
        path: '/',
        domain: 'localhost'
      });
      return res.status(401).json({ 
        error: 'Token expired',
        message: 'Your session has expired. Please log in again.'
      });
    }
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ 
        error: 'Invalid token',
        message: 'Authentication token is invalid'
      });
    }

    return res.status(500).json({ 
      error: 'Authentication error',
      message: 'An error occurred during authentication'
    });
  }
};

/**
 * Middleware to verify user role
 * Use after verifyToken middleware
 */
const verifyRole = (allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ 
        error: 'Authentication required',
        message: 'User not authenticated'
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ 
        error: 'Access denied',
        message: 'You do not have permission to access this resource'
      });
    }

    next();
  };
};

/**
 * Optional authentication - doesn't fail if no token
 * Adds user info to request if token is valid
 */
const optionalAuth = (req, res, next) => {
  try {
    const token = req.cookies.authToken;

    if (token) {
      const decoded = jwt.verify(token, JWT_SECRET);
      req.user = {
        id: decoded.id,
        username: decoded.username,
        role: decoded.role || 'customer'
      };
    }
  } catch (error) {
    // Ignore errors for optional auth
    req.user = null;
  }

  next();
};

module.exports = {
  verifyToken,
  verifyRole,
  optionalAuth
};

