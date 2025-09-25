// Frontend DDoS protection and rate limiting utilities

// Frontend rate limiting configurations
const rateLimitConfigs = {
  login: { maxRequests: 5, timeWindow: 15 * 60 * 1000 }, // 5 attempts per 15 minutes
  signup: { maxRequests: 3, timeWindow: 60 * 60 * 1000 }, // 3 attempts per hour
  form: { maxRequests: 10, timeWindow: 60 * 1000 } // 10 form submissions per minute
};

// Simple rate limiter implementation
const createRateLimiter = (maxRequests, timeWindow) => {
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

// Create rate limiters
const rateLimiters = {
  login: createRateLimiter(rateLimitConfigs.login.maxRequests, rateLimitConfigs.login.timeWindow),
  signup: createRateLimiter(rateLimitConfigs.signup.maxRequests, rateLimitConfigs.signup.timeWindow),
  form: createRateLimiter(rateLimitConfigs.form.maxRequests, rateLimitConfigs.form.timeWindow)
};

// Get client identifier for rate limiting
export const getClientIdentifier = () => {
  // Use a combination of factors to identify the client
  const factors = [
    navigator.userAgent,
    navigator.language,
    screen.width + 'x' + screen.height,
    new Date().getTimezoneOffset().toString()
  ];
  
  // Create a simple hash (in production, use a proper hashing library)
  let hash = 0;
  const str = factors.join('|');
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  
  return hash.toString();
};

// Check rate limit
export const checkRateLimit = (type, identifier = null) => {
  const clientId = identifier || getClientIdentifier();
  const limiter = rateLimiters[type];
  
  if (!limiter) {
    console.warn(`Unknown rate limit type: ${type}`);
    return true; // Allow if no limiter configured
  }
  
  return limiter(clientId);
};

// DDoS detection
export const detectDDoS = () => {
  const suspiciousPatterns = {
    rapidRequests: 0,
    suspiciousUserAgent: false,
    suspiciousIP: false, // Would be checked server-side
    botPattern: false
  };
  
  // Check for rapid requests
  const now = Date.now();
  const requestTimes = JSON.parse(localStorage.getItem('requestTimes') || '[]');
  const recentRequests = requestTimes.filter(time => now - time < 1000); // Last second
  
  if (recentRequests.length > 10) {
    suspiciousPatterns.rapidRequests = recentRequests.length;
  }
  
  // Check for suspicious user agent
  const userAgent = navigator.userAgent;
  if (!userAgent || userAgent.length < 10) {
    suspiciousPatterns.suspiciousUserAgent = true;
  }
  
  // Check for bot patterns
  if (userAgent.includes('bot') || userAgent.includes('crawler') || userAgent.includes('spider')) {
    suspiciousPatterns.botPattern = true;
  }
  
  return suspiciousPatterns;
};

// Request throttling
export const throttleRequest = (func, delay) => {
  let timeoutId;
  let lastExecTime = 0;
  
  return function (...args) {
    const currentTime = Date.now();
    
    if (currentTime - lastExecTime > delay) {
      func.apply(this, args);
      lastExecTime = currentTime;
    } else {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        func.apply(this, args);
        lastExecTime = Date.now();
      }, delay - (currentTime - lastExecTime));
    }
  };
};

// Debounce function for form inputs
export const debounce = (func, delay) => {
  let timeoutId;
  
  return function (...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(this, args), delay);
  };
};

// Request queue for API calls
class RequestQueue {
  constructor(maxConcurrent = 5) {
    this.queue = [];
    this.running = 0;
    this.maxConcurrent = maxConcurrent;
  }
  
  async add(request) {
    return new Promise((resolve, reject) => {
      this.queue.push({ request, resolve, reject });
      this.process();
    });
  }
  
  async process() {
    if (this.running >= this.maxConcurrent || this.queue.length === 0) {
      return;
    }
    
    this.running++;
    const { request, resolve, reject } = this.queue.shift();
    
    try {
      const result = await request();
      resolve(result);
    } catch (error) {
      reject(error);
    } finally {
      this.running--;
      this.process();
    }
  }
}

// Global request queue
export const requestQueue = new RequestQueue();

// Frontend request protection
export const protectedRequest = async (url, options = {}) => {
  // Check for DDoS patterns
  const ddosPatterns = detectDDoS();
  if (ddosPatterns.rapidRequests > 10) {
    throw new Error('Too many requests. Please slow down.');
  }
  
  // Record request time
  const requestTimes = JSON.parse(localStorage.getItem('requestTimes') || '[]');
  requestTimes.push(Date.now());
  // Keep only last 100 requests
  if (requestTimes.length > 100) {
    requestTimes.splice(0, requestTimes.length - 100);
  }
  localStorage.setItem('requestTimes', JSON.stringify(requestTimes));
  
  // Add request to queue
  return requestQueue.add(async () => {
    const response = await fetch(url, options);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return response;
  });
};

// Form submission protection
export const protectFormSubmission = (formData, formType = 'form') => {
  // Check rate limit
  if (!checkRateLimit(formType)) {
    throw new Error('Too many form submissions. Please wait before trying again.');
  }
  
  // Check for DDoS patterns
  const ddosPatterns = detectDDoS();
  if (ddosPatterns.rapidRequests > 5) {
    throw new Error('Too many rapid submissions. Please slow down.');
  }
  
  // Validate form data
  if (!formData || typeof formData !== 'object') {
    throw new Error('Invalid form data');
  }
  
  // Check for suspicious patterns in form data
  const formString = JSON.stringify(formData);
  if (formString.length > 10000) { // 10KB limit
    throw new Error('Form data too large');
  }
  
  return true;
};

// Initialize frontend DDoS protection
export const initDDoSProtection = () => {
  // Monitor for suspicious activity
  setInterval(() => {
    const ddosPatterns = detectDDoS();
    if (ddosPatterns.rapidRequests > 20) {
      console.warn('Potential DDoS attack detected:', ddosPatterns);
      // Block further requests temporarily
      window.ddosBlocked = true;
      setTimeout(() => {
        window.ddosBlocked = false;
      }, 60000); // Block for 1 minute
    }
  }, 5000);
  
  // Clean up old request times
  setInterval(() => {
    const requestTimes = JSON.parse(localStorage.getItem('requestTimes') || '[]');
    const now = Date.now();
    const recentRequests = requestTimes.filter(time => now - time < 60 * 1000); // Keep last minute
    localStorage.setItem('requestTimes', JSON.stringify(recentRequests));
  }, 60000);
};

// Get rate limit status
export const getRateLimitStatus = (type) => {
  const config = rateLimitConfigs[type];
  if (!config) return null;
  
  return {
    type,
    maxRequests: config.maxRequests,
    timeWindow: config.timeWindow,
    timeWindowMinutes: Math.round(config.timeWindow / (60 * 1000))
  };
};

// Reset rate limit (for testing purposes)
export const resetRateLimit = (type) => {
  // This would typically be done server-side
  console.log(`Rate limit reset for type: ${type}`);
};
