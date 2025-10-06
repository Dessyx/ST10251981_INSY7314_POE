// Security Provider component for React app

import React, { createContext, useContext, useEffect, useState } from 'react';
import { initSecurity, startSecurityMonitoring, logSecurityStatus } from '../utils/securityInit';

const SecurityContext = createContext();

export const useSecurity = () => {
  const context = useContext(SecurityContext);
  if (!context) {
    throw new Error('useSecurity must be used within a SecurityProvider');
  }
  return context;
};

export const SecurityProvider = ({ children }) => {
  const [securityStatus, setSecurityStatus] = useState({
    initialized: false,
    https: false,
    secureContext: false,
    sessionValid: false
  });

  useEffect(() => {
    // Initialize security measures
    initSecurity();
    
    // Start security monitoring
    startSecurityMonitoring();
    
    // Update security status
    const status = logSecurityStatus();
    setSecurityStatus({
      initialized: true,
      ...status
    });
    
    // Monitor security status changes
    const interval = setInterval(() => {
      const currentStatus = logSecurityStatus();
      setSecurityStatus(prev => ({
        ...prev,
        ...currentStatus
      }));
    }, 30000); // Check every 30 seconds
    
    return () => clearInterval(interval);
  }, []);

  const value = {
    securityStatus,
    logSecurityStatus
  };

  return (
    <SecurityContext.Provider value={value}>
      {children}
    </SecurityContext.Provider>
  );
};
