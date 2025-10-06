// Initialize all frontend security measures

import { initXSSProtection } from './xssProtection';
import { initClickjackingProtection } from './clickjackingProtection';
import { initNetworkSecurity } from './httpsProtection';
import { initDDoSProtection } from './ddosProtection';
import sessionManager from './sessionManager';

// Initialize all frontend security measures
export const initSecurity = () => {
  console.log('Initializing frontend security measures...');
  
  try {
    // Initialize XSS protection
    initXSSProtection();
    console.log('✅ XSS protection initialized');
    
    // Initialize clickjacking protection
    initClickjackingProtection();
    console.log('✅ Clickjacking protection initialized');
    
    // Initialize network security (HTTPS, MITM protection)
    initNetworkSecurity();
    console.log('✅ Network security initialized');
    
    // Initialize DDoS protection
    initDDoSProtection();
    console.log('✅ DDoS protection initialized');
    
    // Initialize session management
    sessionManager.init();
    console.log('✅ Session management initialized');
    
    console.log('🔒 All frontend security measures initialized successfully');
    
    // Log security status
    logSecurityStatus();
    
  } catch (error) {
    console.error('❌ Error initializing security measures:', error);
  }
};

// Log current security status
export const logSecurityStatus = () => {
  const securityStatus = {
    https: window.location.protocol === 'https:',
    secureContext: window.isSecureContext,
    sessionValid: sessionManager.isAuthenticated(),
    timestamp: new Date().toISOString()
  };
  
  console.log('🔒 Security Status:', securityStatus);
  
  // Warn about security issues
  if (!securityStatus.https && window.location.hostname !== 'localhost') {
    console.warn('⚠️ Security Warning: Not using HTTPS');
  }
  
  if (!securityStatus.secureContext) {
    console.warn('⚠️ Security Warning: Not in secure context');
  }
  
  return securityStatus;
};

// Security monitoring
export const startSecurityMonitoring = () => {
  // Monitor security status every 30 seconds
  setInterval(() => {
    logSecurityStatus();
  }, 30000);
  
  // Monitor for security violations
  window.addEventListener('error', (e) => {
    if (e.message && e.message.includes('XSS')) {
      console.error('🚨 XSS attempt detected:', e.message);
    }
  });
  
  // Monitor for suspicious activity
  let clickCount = 0;
  let lastClickTime = 0;
  
  document.addEventListener('click', (e) => {
    const now = Date.now();
    if (now - lastClickTime < 100) { // Less than 100ms between clicks
      clickCount++;
      if (clickCount > 10) {
        console.warn('⚠️ Suspicious rapid clicking detected');
      }
    } else {
      clickCount = 0;
    }
    lastClickTime = now;
  });
};

// Export security utilities for use in components
export {
  sessionManager,
  initXSSProtection,
  initClickjackingProtection,
  initNetworkSecurity,
  initDDoSProtection
};
