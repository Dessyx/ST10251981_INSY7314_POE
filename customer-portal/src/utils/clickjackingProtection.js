// Clickjacking protection utilities

// Frame busting script to prevent clickjacking
export const frameBustingScript = `
(function() {
  if (window !== window.top) {
    // Check if we're in a frame
    try {
      // Try to access parent window
      if (window.parent !== window) {
        // We're in a frame, redirect to break out
        window.top.location = window.location;
      }
    } catch (e) {
      // If we can't access parent, we're likely in a cross-origin frame
      // Redirect to break out
      window.top.location = window.location;
    }
  }
})();
`;

// Content Security Policy configuration
export const cspConfig = {
  'default-src': ["'self'"],
  'script-src': ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
  'style-src': ["'self'", "'unsafe-inline'"],
  'img-src': ["'self'", "data:", "https:"],
  'font-src': ["'self'", "https:", "data:"],
  'connect-src': ["'self'"],
  'frame-ancestors': ["'none'"], // Prevent framing
  'base-uri': ["'self'"],
  'form-action': ["'self'"],
  'object-src': ["'none'"],
  'media-src': ["'self'"],
  'worker-src': ["'self'"],
  'child-src': ["'self'"],
  'frame-src': ["'none'"],
  'manifest-src': ["'self'"]
};

// Generate CSP header string
export const generateCSPHeader = () => {
  return Object.entries(cspConfig)
    .map(([directive, sources]) => `${directive} ${sources.join(' ')}`)
    .join('; ');
};

// Validate if current page is in a frame
export const isInFrame = () => {
  try {
    return window !== window.top;
  } catch (e) {
    return true; // If we can't access top, we're likely in a frame
  }
};

// Break out of frame if detected
export const breakOutOfFrame = () => {
  if (isInFrame()) {
    try {
      window.top.location = window.location;
    } catch (e) {
      // If we can't access top window, try to redirect
      window.location = window.location;
    }
  }
};

// Add frame busting to page
export const addFrameBusting = () => {
  // Add frame busting script to head
  const script = document.createElement('script');
  script.textContent = frameBustingScript;
  document.head.appendChild(script);
  
  // Also add as inline script for immediate execution
  const inlineScript = document.createElement('script');
  inlineScript.innerHTML = frameBustingScript;
  document.head.appendChild(inlineScript);
};

// Check for suspicious frame behavior
export const detectSuspiciousFraming = () => {
  const checks = {
    inFrame: isInFrame(),
    frameCount: window.frames.length,
    parentOrigin: null,
    suspicious: false
  };
  
  try {
    checks.parentOrigin = window.parent.location.origin;
    // Check if parent origin is different and suspicious
    if (checks.parentOrigin !== window.location.origin) {
      checks.suspicious = true;
    }
  } catch (e) {
    // Cross-origin access blocked - this is suspicious
    checks.suspicious = true;
  }
  
  return checks;
};

// Monitor for clickjacking attempts
export const monitorClickjacking = () => {
  const suspiciousPatterns = [
    // Check for invisible overlays
    () => {
      const elements = document.querySelectorAll('*');
      for (let element of elements) {
        const style = window.getComputedStyle(element);
        if (style.position === 'fixed' && 
            style.zIndex > 1000 && 
            style.opacity < 0.1) {
          return true;
        }
      }
      return false;
    },
    
    // Check for suspicious event listeners
    () => {
      return document.querySelectorAll('[onclick]').length > 10;
    }
  ];
  
  return suspiciousPatterns.some(check => check());
};

// Initialize clickjacking protection
export const initClickjackingProtection = () => {
  // Add frame busting
  addFrameBusting();
  
  // Check for suspicious framing
  const framingCheck = detectSuspiciousFraming();
  if (framingCheck.suspicious) {
    console.warn('Suspicious framing detected:', framingCheck);
    breakOutOfFrame();
  }
  
  // Monitor for clickjacking attempts
  setInterval(() => {
    if (monitorClickjacking()) {
      console.warn('Potential clickjacking attempt detected');
    }
  }, 5000);
  
  // Add event listeners for additional protection
  document.addEventListener('click', (e) => {
    // Check if click target is suspicious
    const target = e.target;
    if (target.style.position === 'fixed' && 
        target.style.zIndex > 1000 && 
        target.style.opacity < 0.1) {
      e.preventDefault();
      e.stopPropagation();
      console.warn('Blocked suspicious click');
    }
  }, true);
};

// X-Frame-Options header values
export const frameOptions = {
  DENY: 'DENY',
  SAMEORIGIN: 'SAMEORIGIN',
  ALLOW_FROM: 'ALLOW-FROM'
};

// Validate frame options
export const validateFrameOptions = (option, uri = null) => {
  switch (option) {
    case frameOptions.DENY:
      return true;
    case frameOptions.SAMEORIGIN:
      return true;
    case frameOptions.ALLOW_FROM:
      return uri && uri.startsWith('https://');
    default:
      return false;
  }
};
