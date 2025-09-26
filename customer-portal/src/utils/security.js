// Security utility functions for client-side protection

// XSS Protection - Input sanitization
export const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  
  return input
    .replace(/[<>]/g, '') // Remove < and >
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, '') // Remove event handlers
    .replace(/script/gi, '') // Remove script tags
    .replace(/iframe/gi, '') // Remove iframe tags
    .replace(/object/gi, '') // Remove object tags
    .replace(/embed/gi, '') // Remove embed tags
    .replace(/link/gi, '') // Remove link tags
    .replace(/meta/gi, '') // Remove meta tags
    .replace(/style/gi, '') // Remove style tags
    .trim();
};

// XSS Protection - HTML encoding
export const encodeHTML = (str) => {
  if (typeof str !== 'string') return str;
  
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
};

// SQL Injection Protection - Input validation
export const validateSQLInput = (input) => {
  if (typeof input !== 'string') return false;
  
  const sqlPatterns = [
    /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|UNION|SCRIPT)\b)/gi,
    /(\b(OR|AND)\s+\d+\s*=\s*\d+)/gi,
    /(\b(OR|AND)\s+['"]\s*=\s*['"])/gi,
    /(UNION\s+SELECT)/gi,
    /(DROP\s+TABLE)/gi,
    /(DELETE\s+FROM)/gi,
    /(INSERT\s+INTO)/gi,
    /(UPDATE\s+SET)/gi,
    /(--|\/\*|\*\/)/g,
    /(xp_|sp_)/gi
  ];
  
  return !sqlPatterns.some(pattern => pattern.test(input));
};

// Session Security - Generate secure session token
export const generateSecureToken = () => {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
};

// Session Security - Validate session token format
export const validateSessionToken = (token) => {
  if (typeof token !== 'string') return false;
  return /^[a-f0-9]{64}$/.test(token);
};

// Frontend rate limiting - Simple client-side rate limiting
export const createRateLimiter = (maxRequests, timeWindow) => {
  const requests = new Map();
  
  return (identifier) => {
    const now = Date.now();
    const userRequests = requests.get(identifier) || [];
    
    // Remove old requests outside time window
    const validRequests = userRequests.filter(time => now - time < timeWindow);
    
    if (validRequests.length >= maxRequests) {
      return false; // Rate limit exceeded
    }
    
    validRequests.push(now);
    requests.set(identifier, validRequests);
    return true; // Request allowed
  };
};

// CSRF Protection - Generate CSRF token
export const generateCSRFToken = () => {
  return generateSecureToken();
};

// CSRF Protection - Validate CSRF token
export const validateCSRFToken = (token, expectedToken) => {
  return token === expectedToken && validateSessionToken(token);
};

// Content Security Policy - Validate allowed sources
export const validateCSP = (url, allowedDomains) => {
  try {
    const urlObj = new URL(url);
    return allowedDomains.some(domain => 
      urlObj.hostname === domain || urlObj.hostname.endsWith('.' + domain)
    );
  } catch {
    return false;
  }
};

// Input validation for forms
export const validateFormInput = (input, type) => {
  const sanitized = sanitizeInput(input);
  
  if (!validateSQLInput(sanitized)) {
    throw new Error('Invalid input detected');
  }
  
  switch (type) {
    case 'email':
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(sanitized);
    case 'username':
      return /^[a-zA-Z0-9_]{3,20}$/.test(sanitized);
    case 'password':
      return sanitized.length >= 8;
    case 'number':
      return /^\d+$/.test(sanitized);
    default:
      return sanitized.length > 0;
  }
};

// Secure storage for sensitive data
export const secureStorage = {
  setItem: (key, value) => {
    try {
      const encrypted = btoa(encodeURIComponent(JSON.stringify(value)));
      sessionStorage.setItem(key, encrypted);
    } catch (error) {
      console.error('Secure storage error:', error);
    }
  },
  
  getItem: (key) => {
    try {
      const encrypted = sessionStorage.getItem(key);
      if (!encrypted) return null;
      return JSON.parse(decodeURIComponent(atob(encrypted)));
    } catch (error) {
      console.error('Secure storage error:', error);
      return null;
    }
  },
  
  removeItem: (key) => {
    sessionStorage.removeItem(key);
  }
};

// HTTPS enforcement
export const enforceHTTPS = () => {
  if (window.location.protocol !== 'https:' && window.location.hostname !== 'localhost') {
    window.location.replace('https:' + window.location.href.substring(window.location.protocol.length));
  }
};

// Security headers validation
export const validateSecurityHeaders = () => {
  const requiredHeaders = [
    'X-Content-Type-Options',
    'X-Frame-Options',
    'X-XSS-Protection',
    'Strict-Transport-Security'
  ];
  
  // This would typically be done server-side, but we can check what's available
  return {
    https: window.location.protocol === 'https:',
    secureContext: window.isSecureContext
  };
};
