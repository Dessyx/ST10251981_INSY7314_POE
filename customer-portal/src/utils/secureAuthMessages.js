// Secure authentication error messages to prevent credential enumeration

// Generic error messages that don't reveal whether credentials are valid
export const SECURE_AUTH_MESSAGES = {
  // Generic login failure message
  LOGIN_FAILED: 'Authentication failed. Please check your credentials and try again.',
  
  // Generic registration failure message
  REGISTRATION_FAILED: 'Registration failed. Please check your information and try again.',
  
  // Rate limiting messages
  RATE_LIMIT_EXCEEDED: 'Too many attempts. Please wait before trying again.',
  
  // Session messages
  SESSION_EXPIRED: 'Your session has expired. Please log in again.',
  SESSION_INVALID: 'Invalid session. Please log in again.',
  
  // Security messages
  SECURITY_VIOLATION: 'Security violation detected. Please try again.',
  
  // Network errors
  NETWORK_ERROR: 'Network error. Please check your connection and try again.',
  
  // Server errors
  SERVER_ERROR: 'Server error. Please try again later.',
  
  // Validation errors (these are safe to show as they don't reveal credential validity)
  VALIDATION_ERROR: 'Please check your input and try again.',
  REQUIRED_FIELD: 'This field is required.',
  INVALID_FORMAT: 'Please enter a valid format.',
  
  // Account status messages
  ACCOUNT_LOCKED: 'Account temporarily locked. Please try again later.',
  ACCOUNT_DISABLED: 'Account access is currently disabled.',
  
  // Password requirements (safe to show)
  PASSWORD_TOO_SHORT: 'Password must be at least 8 characters long.',
  PASSWORD_TOO_WEAK: 'Password must contain at least one uppercase letter, one lowercase letter, and one number.',
  
  // Username requirements (safe to show)
  USERNAME_TOO_SHORT: 'Username must be at least 3 characters long.',
  USERNAME_INVALID_CHARS: 'Username can only contain letters, numbers, and underscores.',
  
  // Account number requirements (safe to show)
  ACCOUNT_NUMBER_INVALID: 'Account number must be numeric and 8-12 digits long.'
};

// Function to determine appropriate error message based on error type
export const getSecureErrorMessage = (error, context = 'login') => {
  // Handle specific error types that are safe to show
  if (error?.type === 'validation') {
    return error.message || SECURE_AUTH_MESSAGES.VALIDATION_ERROR;
  }
  
  if (error?.type === 'rate_limit') {
    return SECURE_AUTH_MESSAGES.RATE_LIMIT_EXCEEDED;
  }
  
  if (error?.type === 'network') {
    return SECURE_AUTH_MESSAGES.NETWORK_ERROR;
  }
  
  if (error?.type === 'server') {
    return SECURE_AUTH_MESSAGES.SERVER_ERROR;
  }
  
  if (error?.type === 'session') {
    return SECURE_AUTH_MESSAGES.SESSION_EXPIRED;
  }
  
  // For authentication errors, always use generic message to prevent enumeration
  if (context === 'login') {
    return SECURE_AUTH_MESSAGES.LOGIN_FAILED;
  }
  
  if (context === 'register') {
    return SECURE_AUTH_MESSAGES.REGISTRATION_FAILED;
  }
  
  // Default fallback
  return SECURE_AUTH_MESSAGES.SECURITY_VIOLATION;
};

// Function to sanitize error responses from server
export const sanitizeAuthError = (serverError) => {
  // Extract error type without revealing sensitive information
  const errorType = serverError?.type || 'unknown';
  
  // Map server error types to secure messages
  const errorMap = {
    'invalid_credentials': 'auth_failed',
    'user_not_found': 'auth_failed',
    'wrong_password': 'auth_failed',
    'account_locked': 'account_locked',
    'account_disabled': 'account_disabled',
    'rate_limit': 'rate_limit',
    'validation_error': 'validation',
    'network_error': 'network',
    'server_error': 'server',
    'session_expired': 'session'
  };
  
  return {
    type: errorMap[errorType] || 'unknown',
    message: getSecureErrorMessage({ type: errorMap[errorType] || 'unknown' })
  };
};

// Function to add delay to authentication responses to prevent timing attacks
export const addAuthDelay = (minDelay = 500, maxDelay = 1000) => {
  const delay = Math.random() * (maxDelay - minDelay) + minDelay;
  return new Promise(resolve => setTimeout(resolve, delay));
};

// Function to validate error message security
export const isSecureErrorMessage = (message) => {
  const insecurePatterns = [
    /user.*not.*found/i,
    /invalid.*username/i,
    /wrong.*password/i,
    /incorrect.*password/i,
    /username.*does.*not.*exist/i,
    /account.*does.*not.*exist/i,
    /password.*incorrect/i,
    /invalid.*credentials/i,
    /bad.*password/i,
    /wrong.*username/i
  ];
  
  return !insecurePatterns.some(pattern => pattern.test(message));
};

// Function to log security events
export const logSecurityEvent = (event, details = {}) => {
  const timestamp = new Date().toISOString();
  const logEntry = {
    timestamp,
    event,
    details,
    userAgent: navigator.userAgent,
    url: window.location.href
  };
  
  // Log to console in development
  if (process.env.NODE_ENV === 'development') {
    console.log('Security Event:', logEntry);
  }
  
  // In production, you might want to send this to a security monitoring service
  // Example: sendToSecurityService(logEntry);
};

export default {
  SECURE_AUTH_MESSAGES,
  getSecureErrorMessage,
  sanitizeAuthError,
  addAuthDelay,
  isSecureErrorMessage,
  logSecurityEvent
};
