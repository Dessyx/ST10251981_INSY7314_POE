// Session management with security features

import { generateSecureToken, validateSessionToken, secureStorage } from './security';

class SessionManager {
  constructor() {
    this.sessionToken = null;
    this.csrfToken = null;
    this.lastActivity = Date.now();
    this.sessionTimeout = 30 * 60 * 1000; // 30 minutes
    this.heartbeatInterval = null;
    
    this.init();
  }

  init() {
    // Check for existing session
    this.sessionToken = secureStorage.getItem('sessionToken');
    this.csrfToken = secureStorage.getItem('csrfToken');
    this.lastActivity = secureStorage.getItem('lastActivity') || Date.now();
    
    // If user is authenticated but no lastActivity, set it to now
    const userId = localStorage.getItem('userId');
    if (userId && !this.lastActivity) {
      this.lastActivity = Date.now();
      secureStorage.setItem('lastActivity', this.lastActivity);
    }
    
    if (this.sessionToken && !validateSessionToken(this.sessionToken)) {
      this.clearSession();
    }
    
    // Start session monitoring
    this.startHeartbeat();
    this.setupActivityTracking();
  }

  // Generate new secure session
  createSession() {
    this.sessionToken = generateSecureToken();
    this.csrfToken = generateSecureToken();
    this.lastActivity = Date.now();
    
    secureStorage.setItem('sessionToken', this.sessionToken);
    secureStorage.setItem('csrfToken', this.csrfToken);
    secureStorage.setItem('lastActivity', this.lastActivity);
    
    this.startHeartbeat();
    return this.sessionToken;
  }

  // Validate current session
  validateSession() {
    // Check if user is authenticated via localStorage (auth service)
    const userId = localStorage.getItem('userId');
    if (!userId) {
      return false;
    }
    
    // Check session timeout based on last activity
    const now = Date.now();
    if (now - this.lastActivity > this.sessionTimeout) {
      this.clearSession();
      return false;
    }
    
    this.lastActivity = now;
    secureStorage.setItem('lastActivity', this.lastActivity);
    return true;
  }

  // Clear session data
  clearSession() {
    this.sessionToken = null;
    this.csrfToken = null;
    this.lastActivity = null;
    
    secureStorage.removeItem('sessionToken');
    secureStorage.removeItem('csrfToken');
    secureStorage.removeItem('lastActivity');
    
    // Clear auth service data
    localStorage.removeItem('userRole');
    localStorage.removeItem('userId');
    localStorage.removeItem('username');
    localStorage.removeItem('fullName');
    
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
  }

  // Start heartbeat to maintain session
  startHeartbeat() {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
    }
    
    this.heartbeatInterval = setInterval(() => {
      if (!this.validateSession()) {
        this.handleSessionExpired();
      } else {
        // Check for warning time (5 minutes before expiry)
        this.checkSessionWarning();
      }
    }, 60000); // Check every minute
  }

  // Track user activity
  setupActivityTracking() {
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
    
    const updateActivity = () => {
      this.lastActivity = Date.now();
      secureStorage.setItem('lastActivity', this.lastActivity);
      
      // Hide warning if user is active
      const hideWarningEvent = new CustomEvent('hideSessionWarning');
      window.dispatchEvent(hideWarningEvent);
    };
    
    events.forEach(event => {
      document.addEventListener(event, updateActivity, true);
    });
  }

  // Check for session warning (5 minutes before expiry)
  checkSessionWarning() {
    if (!this.lastActivity) return;
    
    const now = Date.now();
    const timeRemaining = this.sessionTimeout - (now - this.lastActivity);
    const warningTime = 5 * 60 * 1000; // 5 minutes
    
    if (timeRemaining <= warningTime && timeRemaining > 0) {
      // Dispatch warning event
      const warningEvent = new CustomEvent('sessionWarning', {
        detail: {
          message: 'Your session will expire in 5 minutes. Click "Extend Session" to continue.',
          timeRemaining: timeRemaining
        }
      });
      window.dispatchEvent(warningEvent);
    }
  }

  // Handle session expiration
  handleSessionExpired() {
    this.clearSession();
    
    // Dispatch session expired event
    const expiredEvent = new CustomEvent('sessionExpired', {
      detail: {
        message: 'Your session has expired. Please log in again.'
      }
    });
    window.dispatchEvent(expiredEvent);
    
    alert('Your session has expired. Please log in again.');
    window.location.href = '/signin';
  }

  // Get session headers for API requests
  getSessionHeaders() {
    if (!this.validateSession()) {
      throw new Error('Invalid session');
    }
    
    return {
      'X-Session-Token': this.sessionToken,
      'X-CSRF-Token': this.csrfToken,
      'X-Requested-With': 'XMLHttpRequest'
    };
  }

  // Refresh session token
  refreshSession() {
    if (this.validateSession()) {
      this.csrfToken = generateSecureToken();
      secureStorage.setItem('csrfToken', this.csrfToken);
      return true;
    }
    return false;
  }

  // Check if user is authenticated
  isAuthenticated() {
    return this.validateSession();
  }

  // Get current session info
  getSessionInfo() {
    return {
      isAuthenticated: this.isAuthenticated(),
      lastActivity: this.lastActivity,
      timeRemaining: this.lastActivity ? 
        Math.max(0, this.sessionTimeout - (Date.now() - this.lastActivity)) : 0
    };
  }
}

// Create singleton instance
const sessionManager = new SessionManager();

export default sessionManager;
