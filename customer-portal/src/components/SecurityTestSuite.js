import React, { useState, useEffect } from 'react';
import { isInFrame, detectSuspiciousFraming, monitorClickjacking } from '../utils/clickjackingProtection';
import { isSecureErrorMessage } from '../utils/secureAuthMessages';
import sessionManager from '../utils/sessionManager';
import './SecurityTestSuite.css';

const SecurityTestSuite = () => {
  const [testResults, setTestResults] = useState({});
  const [isRunning, setIsRunning] = useState(false);

  const runSecurityTests = async () => {
    setIsRunning(true);
    const results = {};

    // Test 1: Clickjacking Protection
    try {
      const frameCheck = detectSuspiciousFraming();
      const clickjackingCheck = monitorClickjacking();
      
      results.clickjacking = {
        passed: !frameCheck.suspicious && !clickjackingCheck,
        details: {
          inFrame: frameCheck.inFrame,
          suspicious: frameCheck.suspicious,
          clickjackingDetected: clickjackingCheck
        }
      };
    } catch (error) {
      results.clickjacking = {
        passed: false,
        error: error.message
      };
    }

    // Test 2: Session Management
    try {
      const sessionInfo = sessionManager.getSessionInfo();
      results.session = {
        passed: sessionInfo.isAuthenticated !== undefined,
        details: sessionInfo
      };
    } catch (error) {
      results.session = {
        passed: false,
        error: error.message
      };
    }

    // Test 3: Secure Error Messages
    try {
      const insecureMessages = [
        'User not found',
        'Invalid username',
        'Wrong password',
        'Account does not exist'
      ];
      
      const secureMessages = [
        'Authentication failed. Please check your credentials and try again.',
        'Registration failed. Please check your information and try again.'
      ];

      const insecureResults = insecureMessages.map(msg => isSecureErrorMessage(msg));
      const secureResults = secureMessages.map(msg => isSecureErrorMessage(msg));

      results.errorMessages = {
        passed: insecureResults.every(r => !r) && secureResults.every(r => r),
        details: {
          insecureMessagesBlocked: insecureResults.every(r => !r),
          secureMessagesAllowed: secureResults.every(r => r)
        }
      };
    } catch (error) {
      results.errorMessages = {
        passed: false,
        error: error.message
      };
    }

    // Test 4: HTTPS Protection
    try {
      results.https = {
        passed: window.location.protocol === 'https:' || window.location.hostname === 'localhost',
        details: {
          protocol: window.location.protocol,
          hostname: window.location.hostname
        }
      };
    } catch (error) {
      results.https = {
        passed: false,
        error: error.message
      };
    }

    // Test 5: Content Security Policy
    try {
      const metaTags = document.querySelectorAll('meta[http-equiv="Content-Security-Policy"]');
      results.csp = {
        passed: metaTags.length > 0,
        details: {
          cspMetaTags: metaTags.length,
          hasCSP: metaTags.length > 0
        }
      };
    } catch (error) {
      results.csp = {
        passed: false,
        error: error.message
      };
    }

    // Test 6: X-Frame-Options
    try {
      const frameOptionsTags = document.querySelectorAll('meta[http-equiv="X-Frame-Options"]');
      results.frameOptions = {
        passed: frameOptionsTags.length > 0,
        details: {
          frameOptionsTags: frameOptionsTags.length,
          hasFrameOptions: frameOptionsTags.length > 0
        }
      };
    } catch (error) {
      results.frameOptions = {
        passed: false,
        error: error.message
      };
    }

    setTestResults(results);
    setIsRunning(false);
  };

  const getTestStatus = (result) => {
    if (result.passed === true) return 'passed';
    if (result.passed === false) return 'failed';
    return 'unknown';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'passed': return '#27ae60';
      case 'failed': return '#e74c3c';
      default: return '#f39c12';
    }
  };

  return (
    <div className="security-test-suite">
      <div className="test-header">
        <h2>Security Test Suite</h2>
        <button 
          className="run-tests-btn"
          onClick={runSecurityTests}
          disabled={isRunning}
        >
          {isRunning ? 'Running Tests...' : 'Run Security Tests'}
        </button>
      </div>

      {Object.keys(testResults).length > 0 && (
        <div className="test-results">
          {Object.entries(testResults).map(([testName, result]) => (
            <div key={testName} className="test-result">
              <div className="test-header-row">
                <h3 className="test-name">{testName.charAt(0).toUpperCase() + testName.slice(1)}</h3>
                <span 
                  className="test-status"
                  style={{ color: getStatusColor(getTestStatus(result)) }}
                >
                  {getTestStatus(result).toUpperCase()}
                </span>
              </div>
              
              {result.details && (
                <div className="test-details">
                  <pre>{JSON.stringify(result.details, null, 2)}</pre>
                </div>
              )}
              
              {result.error && (
                <div className="test-error">
                  <strong>Error:</strong> {result.error}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <div className="security-info">
        <h3>Security Features Implemented:</h3>
        <ul>
          <li>✅ Session timeout with warning notifications</li>
          <li>✅ Clickjacking protection with frame busting</li>
          <li>✅ Secure authentication error messages</li>
          <li>✅ Content Security Policy (CSP) headers</li>
          <li>✅ X-Frame-Options headers</li>
          <li>✅ HTTPS enforcement</li>
          <li>✅ Rate limiting protection</li>
          <li>✅ Security event logging</li>
          <li>✅ Timing attack prevention</li>
          <li>✅ Credential enumeration prevention</li>
        </ul>
      </div>
    </div>
  );
};

export default SecurityTestSuite;
