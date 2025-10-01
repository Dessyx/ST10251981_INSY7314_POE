import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import SignInHeader from '../components/SignInHeader';
import { validateSignInForm } from '../utils/validation';
import { protectFormSubmission } from '../utils/ddosProtection';
import { authService } from '../services/authService';
import './SignIn.css';

const SignIn = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    accountNumber: '',
    password: ''
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null
      });
    }
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched({
      ...touched,
      [name]: true
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Protect against DDoS and rate limiting
      protectFormSubmission(formData, 'login');
      
      // Validate form
      const validation = validateSignInForm(formData);
      
      if (!validation.isValid) {
        setErrors(validation.errors);
        setIsSubmitting(false);
        return;
      }

      // Make API call to authenticate the user
      const result = await authService.login(formData);
      
      if (result.success) {
        // Reset form on success
        setFormData({
          username: '',
          accountNumber: '',
          password: ''
        });
        setErrors({});
        setTouched({});
        
        // Redirect based on user role (role is now in result.user.role)
        const userRole = result.user?.role || authService.getUserRole();
        if (userRole === 'employee') {
          navigate('/TransactionDashboard');
        } else {
          navigate('/TransactionHistory');
        }
      } else {
        setErrors({ general: result.error });
      }
    } catch (error) {
      console.error('Login error:', error);
      if (error.message.includes('Rate limit') || error.message.includes('Too many')) {
        setErrors({ general: 'Too many attempts. Please wait before trying again.' });
      } else {
        setErrors({ general: 'Login failed. Please check your credentials and try again.' });
      }
    } finally {
      setIsSubmitting(false);
    }
  };


  return (
    <div className="signin-page">
      <SignInHeader />
        <div className="signin-container">
          <div className="signin-form-container">
            <div className="form-header">
              <div className="paynow-icon">
                <img 
                  src="/images/PayNow.png" 
                  alt="PayNow" 
                  className="icon-image"
                />
              </div>
              <h1 className="signin-title">PayNow</h1>
              <p className="signin-subtitle">Securely Access Your Account</p>
            </div>
            
            <form className="signin-form" onSubmit={handleSubmit}>
              {errors.general && (
                <div className="error-message general-error">{errors.general}</div>
              )}
              
              <div className="form-group">
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  required
                  placeholder="Username"
                  className={errors.username && touched.username ? 'error' : ''}
                />
                {errors.username && touched.username && (
                  <div className="error-message">{errors.username}</div>
                )}
              </div>
              
              <div className="form-group">
                <input
                  type="text"
                  id="accountNumber"
                  name="accountNumber"
                  value={formData.accountNumber}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  required
                  placeholder="Account Number"
                  className={errors.accountNumber && touched.accountNumber ? 'error' : ''}
                />
                {errors.accountNumber && touched.accountNumber && (
                  <div className="error-message">{errors.accountNumber}</div>
                )}
              </div>
              
              <div className="form-group">
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  required
                  placeholder="Password"
                  className={errors.password && touched.password ? 'error' : ''}
                />
                {errors.password && touched.password && (
                  <div className="error-message">{errors.password}</div>
                )}
              </div>
              
              <button 
                type="submit" 
                className="signin-button"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Signing In...' : 'Log In'}
              </button>
              
              <div className="form-footer">
                <p>Don't have an account? <Link to="/signup" className="signup-link">Sign Up Here</Link></p>
              </div>
            </form>
          </div>
        </div>
        <footer className="page-footer">
          <p>© 2025- PayNow All rights reserved</p>
        </footer>
    </div>
  );
};

export default SignIn;
