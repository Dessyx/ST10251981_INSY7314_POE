
const crypto = require('crypto');
const csrfTokenStore = new Map();
const TOKEN_EXPIRY = 15 * 60 * 1000;

// create CSRF token
const generateToken = () => {
  return crypto.randomBytes(32).toString('hex');
};


const createCsrfToken = () => {
  const tokenId = crypto.randomBytes(16).toString('hex');
  const token = generateToken();
  const expiresAt = Date.now() + TOKEN_EXPIRY;
  
  csrfTokenStore.set(tokenId, {
    token,
    expiresAt,
    used: false
  });
  
  cleanupExpiredTokens();
  
  return { tokenId, token };
};

// Validate CSRF token
const validateCsrfToken = (tokenId, token) => {
  const storedToken = csrfTokenStore.get(tokenId);
  
  if (!storedToken) {
    return false;
  }
  
  // Check if token is expired
  if (Date.now() > storedToken.expiresAt) {
    csrfTokenStore.delete(tokenId);
    return false;
  }
  
  if (storedToken.used) {
    return false;
  }
  

  const isValid = crypto.timingSafeEqual(
    Buffer.from(token),
    Buffer.from(storedToken.token)
  );
  
  if (isValid) {
    storedToken.used = true;
  }
  
  return isValid;
};


const cleanupExpiredTokens = () => {
  const now = Date.now();
  for (const [tokenId, data] of csrfTokenStore.entries()) {
    if (now > data.expiresAt || data.used) {
      csrfTokenStore.delete(tokenId);
    }
  }
};


const getCsrfToken = (req, res) => {
  const { tokenId, token } = createCsrfToken();
  
  res.cookie('csrf_token_id', tokenId, {
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
    maxAge: TOKEN_EXPIRY,
    path: '/',
    domain: 'localhost'
  });
  
  res.json({
    csrfToken: token,
    expiresIn: TOKEN_EXPIRY
  });
};


const validateCsrfMiddleware = (req, res, next) => {
  // Skip validation for safe methods
  if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) {
    return next();
  }
  
  // Get token ID from cookie
  const tokenId = req.cookies.csrf_token_id;
  if (!tokenId) {
    return res.status(403).json({
      error: 'CSRF token missing',
      message: 'CSRF token ID not found in cookies'
    });
  }
  
  // Get token from header
  const token = req.headers['x-csrf-token'];
  if (!token) {
    return res.status(403).json({
      error: 'CSRF token missing',
      message: 'CSRF token not found in headers'
    });
  }
  
  // Validate token
  if (!validateCsrfToken(tokenId, token)) {
    res.clearCookie('csrf_token_id', {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      path: '/',
      domain: 'localhost'
    });
    
    return res.status(403).json({
      error: 'Invalid CSRF token',
      message: 'CSRF token validation failed'
    });
  }
  
  next();
};


const csrfProtection = (options = {}) => {
  const skipRoutes = options.skipRoutes || [];
  
  return (req, res, next) => {
    const shouldSkip = skipRoutes.some(route => req.path.startsWith(route));
    
    if (shouldSkip) {
      return next();
    }
    
    validateCsrfMiddleware(req, res, next);
  };
};


setInterval(cleanupExpiredTokens, 5 * 60 * 1000);

module.exports = {
  getCsrfToken,
  validateCsrfMiddleware,
  csrfProtection,
  createCsrfToken,
  validateCsrfToken
};

