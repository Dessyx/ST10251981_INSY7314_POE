import React, { useState, useEffect } from 'react';
import './SessionTimeoutWarning.css';

const SessionTimeoutWarning = () => {
  const [showWarning, setShowWarning] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [warningMessage, setWarningMessage] = useState('');

  useEffect(() => {
    // Listen for session warning events
    const handleSessionWarning = (event) => {
      setWarningMessage(event.detail.message);
      setTimeRemaining(event.detail.timeRemaining);
      setShowWarning(true);
    };

    // Listen for session expired events
    const handleSessionExpired = (event) => {
      setShowWarning(false);
      // The session manager will handle redirect
    };

    // Listen for hide warning events
    const handleHideWarning = () => {
      setShowWarning(false);
    };

    window.addEventListener('sessionWarning', handleSessionWarning);
    window.addEventListener('sessionExpired', handleSessionExpired);
    window.addEventListener('hideSessionWarning', handleHideWarning);

    return () => {
      window.removeEventListener('sessionWarning', handleSessionWarning);
      window.removeEventListener('sessionExpired', handleSessionExpired);
      window.removeEventListener('hideSessionWarning', handleHideWarning);
    };
  }, []);

  const handleExtendSession = () => {
    // Simulate extending session by refreshing activity
    const event = new Event('mousemove');
    document.dispatchEvent(event);
    setShowWarning(false);
  };

  const handleLogout = () => {
    // Redirect to logout
    window.location.href = '/signin';
  };

  const formatTime = (milliseconds) => {
    const minutes = Math.floor(milliseconds / 60000);
    const seconds = Math.floor((milliseconds % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  if (!showWarning) return null;

  return (
    <div className="session-warning-overlay">
      <div className="session-warning-modal">
        <div className="session-warning-header">
          <h3>Session Timeout Warning</h3>
        </div>
        <div className="session-warning-content">
          <p>{warningMessage}</p>
          <p className="time-remaining">
            Time remaining: <strong>{formatTime(timeRemaining)}</strong>
          </p>
          <div className="session-warning-actions">
            <button 
              className="extend-session-btn"
              onClick={handleExtendSession}
            >
              Extend Session
            </button>
            <button 
              className="logout-btn"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SessionTimeoutWarning;
