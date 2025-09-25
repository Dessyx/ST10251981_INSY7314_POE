// XSS Protection utilities

import { sanitizeInput, encodeHTML } from './security';

// XSS attack patterns to detect
const xssPatterns = [
  /<script[^>]*>.*?<\/script>/gi,
  /<iframe[^>]*>.*?<\/iframe>/gi,
  /<object[^>]*>.*?<\/object>/gi,
  /<embed[^>]*>.*?<\/embed>/gi,
  /<link[^>]*>.*?<\/link>/gi,
  /<meta[^>]*>.*?<\/meta>/gi,
  /<style[^>]*>.*?<\/style>/gi,
  /javascript:/gi,
  /vbscript:/gi,
  /data:text\/html/gi,
  /on\w+\s*=/gi,
  /expression\s*\(/gi,
  /url\s*\(/gi,
  /@import/gi,
  /eval\s*\(/gi,
  /setTimeout\s*\(/gi,
  /setInterval\s*\(/gi,
  /Function\s*\(/gi,
  /document\.write/gi,
  /innerHTML/gi,
  /outerHTML/gi,
  /document\.cookie/gi,
  /window\.location/gi,
  /document\.location/gi
];

// Detect XSS attempts
export const detectXSS = (input) => {
  if (typeof input !== 'string') return false;
  
  return xssPatterns.some(pattern => pattern.test(input));
};

// Sanitize HTML content
export const sanitizeHTML = (html) => {
  if (typeof html !== 'string') return html;
  
  // Remove script tags and their content
  let sanitized = html.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '');
  
  // Remove other dangerous tags
  sanitized = sanitized.replace(/<(iframe|object|embed|link|meta|style)[^>]*>[\s\S]*?<\/\1>/gi, '');
  
  // Remove dangerous attributes
  sanitized = sanitized.replace(/\s*on\w+\s*=\s*["'][^"']*["']/gi, '');
  sanitized = sanitized.replace(/\s*javascript\s*:/gi, '');
  sanitized = sanitized.replace(/\s*vbscript\s*:/gi, '');
  
  // Remove dangerous CSS
  sanitized = sanitized.replace(/expression\s*\([^)]*\)/gi, '');
  sanitized = sanitized.replace(/url\s*\([^)]*\)/gi, '');
  sanitized = sanitized.replace(/@import[^;]*;/gi, '');
  
  return sanitized;
};

// Safe HTML rendering
export const safeHTML = (content) => {
  if (typeof content !== 'string') return content;
  
  // First sanitize the input
  const sanitized = sanitizeInput(content);
  
  // Then encode HTML entities
  return encodeHTML(sanitized);
};

// Validate and sanitize user input
export const validateAndSanitize = (input, type = 'text') => {
  if (typeof input !== 'string') return input;
  
  // Detect XSS attempts
  if (detectXSS(input)) {
    console.warn('XSS attempt detected:', input);
    throw new Error('Invalid input detected');
  }
  
  // Sanitize based on type
  switch (type) {
    case 'html':
      return sanitizeHTML(input);
    case 'text':
    default:
      return sanitizeInput(input);
  }
};

// DOM XSS protection
export const protectDOM = () => {
  // Override dangerous DOM methods
  const originalInnerHTML = Element.prototype.__lookupSetter__('innerHTML');
  const originalOuterHTML = Element.prototype.__lookupSetter__('outerHTML');
  
  if (originalInnerHTML) {
    Element.prototype.__defineSetter__('innerHTML', function(value) {
      const sanitized = sanitizeHTML(value);
      originalInnerHTML.call(this, sanitized);
    });
  }
  
  if (originalOuterHTML) {
    Element.prototype.__defineSetter__('outerHTML', function(value) {
      const sanitized = sanitizeHTML(value);
      originalOuterHTML.call(this, sanitized);
    });
  }
  
  // Override document.write
  const originalWrite = document.write;
  document.write = function(content) {
    const sanitized = sanitizeHTML(content);
    originalWrite.call(this, sanitized);
  };
  
  // Override document.writeln
  const originalWriteln = document.writeln;
  document.writeln = function(content) {
    const sanitized = sanitizeHTML(content);
    originalWriteln.call(this, sanitized);
  };
};

// Content Security Policy for XSS protection
export const xssCSP = {
  'default-src': ["'self'"],
  'script-src': ["'self'", "'unsafe-inline'"],
  'style-src': ["'self'", "'unsafe-inline'"],
  'img-src': ["'self'", "data:", "https:"],
  'font-src': ["'self'", "https:", "data:"],
  'connect-src': ["'self'"],
  'frame-ancestors': ["'none'"],
  'base-uri': ["'self'"],
  'form-action': ["'self'"],
  'object-src': ["'none'"],
  'media-src': ["'self'"],
  'worker-src': ["'self'"],
  'child-src': ["'self'"],
  'frame-src': ["'none'"],
  'manifest-src': ["'self'"]
};

// Generate XSS protection CSP header
export const generateXSSProtectionCSP = () => {
  return Object.entries(xssCSP)
    .map(([directive, sources]) => `${directive} ${sources.join(' ')}`)
    .join('; ');
};

// XSS protection for form inputs
export const protectFormInputs = () => {
  // Add event listeners to all form inputs
  const inputs = document.querySelectorAll('input, textarea, select');
  
  inputs.forEach(input => {
    // Sanitize on input
    input.addEventListener('input', (e) => {
      const sanitized = sanitizeInput(e.target.value);
      if (sanitized !== e.target.value) {
        e.target.value = sanitized;
        console.warn('Input sanitized for XSS protection');
      }
    });
    
    // Validate on blur
    input.addEventListener('blur', (e) => {
      if (detectXSS(e.target.value)) {
        e.target.value = sanitizeInput(e.target.value);
        console.warn('XSS attempt blocked in form input');
      }
    });
  });
};

// Initialize XSS protection
export const initXSSProtection = () => {
  // Protect DOM methods
  protectDOM();
  
  // Protect form inputs
  protectFormInputs();
  
  // Add global XSS detection
  window.addEventListener('error', (e) => {
    if (e.message && detectXSS(e.message)) {
      console.warn('XSS attempt detected in error:', e.message);
      e.preventDefault();
    }
  });
  
  // Monitor for suspicious script execution
  const originalEval = window.eval;
  window.eval = function(code) {
    if (detectXSS(code)) {
      console.warn('XSS attempt blocked in eval');
      throw new Error('XSS attempt blocked');
    }
    return originalEval.call(this, code);
  };
};

// XSS protection for API responses
export const sanitizeAPIResponse = (response) => {
  if (typeof response === 'string') {
    return sanitizeInput(response);
  }
  
  if (Array.isArray(response)) {
    return response.map(item => sanitizeAPIResponse(item));
  }
  
  if (typeof response === 'object' && response !== null) {
    const sanitized = {};
    for (const [key, value] of Object.entries(response)) {
      sanitized[sanitizeInput(key)] = sanitizeAPIResponse(value);
    }
    return sanitized;
  }
  
  return response;
};
