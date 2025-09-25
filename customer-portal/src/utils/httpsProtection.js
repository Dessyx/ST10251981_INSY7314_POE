// HTTPS and MITM protection utilities

import { enforceHTTPS, validateSecurityHeaders } from './security';

// HTTPS enforcement
export const initHTTPSProtection = () => {
  // Enforce HTTPS
  enforceHTTPS();
  
  // Check for secure context
  if (!window.isSecureContext) {
    console.warn('Application is not running in a secure context');
    // Redirect to HTTPS
    if (location.protocol !== 'https:' && location.hostname !== 'localhost') {
      location.replace('https:' + window.location.href.substring(window.location.protocol.length));
    }
  }
};

// Certificate pinning simulation (client-side)
export const validateCertificate = () => {
  // In a real application, this would be done server-side
  // This is a client-side simulation for demonstration
  const securityInfo = validateSecurityHeaders();
  
  return {
    isSecure: securityInfo.https && securityInfo.secureContext,
    protocol: location.protocol,
    hostname: location.hostname,
    isLocalhost: location.hostname === 'localhost' || location.hostname === '127.0.0.1'
  };
};

// Mixed content detection
export const detectMixedContent = () => {
  const mixedContent = [];
  
  // Check for HTTP resources on HTTPS page
  const images = document.querySelectorAll('img[src^="http:"]');
  const scripts = document.querySelectorAll('script[src^="http:"]');
  const links = document.querySelectorAll('link[href^="http:"]');
  const iframes = document.querySelectorAll('iframe[src^="http:"]');
  
  images.forEach(img => mixedContent.push({ type: 'image', element: img }));
  scripts.forEach(script => mixedContent.push({ type: 'script', element: script }));
  links.forEach(link => mixedContent.push({ type: 'link', element: link }));
  iframes.forEach(iframe => mixedContent.push({ type: 'iframe', element: iframe }));
  
  return mixedContent;
};

// Fix mixed content issues
export const fixMixedContent = () => {
  const mixedContent = detectMixedContent();
  
  mixedContent.forEach(item => {
    const element = item.element;
    const src = element.src || element.href;
    
    if (src && src.startsWith('http:')) {
      const httpsSrc = src.replace('http:', 'https:');
      
      if (item.type === 'image') {
        element.src = httpsSrc;
      } else if (item.type === 'script') {
        element.src = httpsSrc;
      } else if (item.type === 'link') {
        element.href = httpsSrc;
      } else if (item.type === 'iframe') {
        element.src = httpsSrc;
      }
      
      console.log(`Fixed mixed content: ${src} -> ${httpsSrc}`);
    }
  });
};

// HSTS (HTTP Strict Transport Security) simulation
export const checkHSTS = () => {
  // In a real application, this would be checked via server headers
  // This is a client-side simulation
  const isHTTPS = location.protocol === 'https:';
  const isSecureContext = window.isSecureContext;
  
  return {
    hstsEnabled: isHTTPS && isSecureContext,
    isHTTPS,
    isSecureContext
  };
};

// SSL/TLS validation
export const validateSSL = () => {
  const securityInfo = validateSecurityHeaders();
  
  return {
    isSecure: securityInfo.https,
    protocol: location.protocol,
    secureContext: securityInfo.secureContext,
    timestamp: Date.now()
  };
};

// Network security monitoring
export const monitorNetworkSecurity = () => {
  const securityChecks = {
    https: location.protocol === 'https:',
    secureContext: window.isSecureContext,
    mixedContent: detectMixedContent().length === 0,
    hsts: checkHSTS().hstsEnabled
  };
  
  // Log security status
  console.log('Network Security Status:', securityChecks);
  
  // Alert if security issues detected
  if (!securityChecks.https && location.hostname !== 'localhost') {
    console.error('Security Warning: Not using HTTPS');
  }
  
  if (securityChecks.mixedContent === false) {
    console.warn('Security Warning: Mixed content detected');
    fixMixedContent();
  }
  
  return securityChecks;
};

// Initialize HTTPS protection
export const initNetworkSecurity = () => {
  // Initialize HTTPS protection
  initHTTPSProtection();
  
  // Monitor network security
  monitorNetworkSecurity();
  
  // Set up periodic security checks
  setInterval(monitorNetworkSecurity, 30000); // Check every 30 seconds
  
  // Monitor for protocol changes
  window.addEventListener('beforeunload', () => {
    const securityInfo = validateSSL();
    if (!securityInfo.isSecure && location.hostname !== 'localhost') {
      console.warn('Leaving secure context');
    }
  });
  
  // Monitor for mixed content
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === 'childList') {
        const mixedContent = detectMixedContent();
        if (mixedContent.length > 0) {
          console.warn('New mixed content detected:', mixedContent);
          fixMixedContent();
        }
      }
    });
  });
  
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
};

// API request security
export const secureAPIRequest = (url, options = {}) => {
  // Ensure HTTPS for API requests
  if (url.startsWith('http:') && location.protocol === 'https:') {
    url = url.replace('http:', 'https:');
  }
  
  // Add security headers
  const secureOptions = {
    ...options,
    headers: {
      'X-Requested-With': 'XMLHttpRequest',
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'X-XSS-Protection': '1; mode=block',
      ...options.headers
    }
  };
  
  return { url, options: secureOptions };
};

// WebSocket security
export const secureWebSocket = (url) => {
  // Ensure WSS for WebSocket connections
  if (url.startsWith('ws:') && location.protocol === 'https:') {
    url = url.replace('ws:', 'wss:');
  }
  
  return url;
};
