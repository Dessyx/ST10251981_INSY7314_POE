import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import SignInHeader from '../components/SignInHeader';
import { 
  validateSignUpForm, 
  validateFullName, 
  validateIdNumber, 
  validateAccountNumber, 
  validateUsername, 
  validatePassword 
} from '../utils/validation';
import { protectFormSubmission } from '../utils/ddosProtection';
import { authService } from '../services/authService';
import './SignUp.css';

const SignUp = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    idNumber: '',
    accountNumber: '',
    username: '',
    password: ''
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateField = (name, value) => {
    switch (name) {
      case 'fullName':
        return validateFullName(value);
      case 'idNumber':
        return validateIdNumber(value);
      case 'accountNumber':
        return validateAccountNumber(value);
      case 'username':
        return validateUsername(value);
      case 'password':
        return validatePassword(value);
      default:
        return { isValid: true, error: null };
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });

    // Real-time validation
    if (touched[name] || value.length > 0) {
      const validation = validateField(name, value);
      if (!validation.isValid) {
        setErrors({
          ...errors,
          [name]: validation.error
        });
      } else {
        // Clear error if validation passes
        setErrors({
          ...errors,
          [name]: null
        });
      }
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched({
      ...touched,
      [name]: true
    });

    // Validate field on blur
    const validation = validateField(name, value);
    if (!validation.isValid) {
      setErrors({
        ...errors,
        [name]: validation.error
      });
    } else {
      setErrors({
        ...errors,
        [name]: null
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Protect against DDoS and rate limiting
      protectFormSubmission(formData, 'signup');
      
      // Validate form
      const validation = validateSignUpForm(formData);
      
      if (!validation.isValid) {
        setErrors(validation.errors);
        setIsSubmitting(false);
        return;
      }

      // Make API call to register the user
      const result = await authService.register(formData);
      
      if (result.success) {
        // Reset form on success
        setFormData({
          fullName: '',
          idNumber: '',
          accountNumber: '',
          username: '',
          password: ''
        });
        setErrors({});
        setTouched({});
        
        // Navigate to login page after successful registration
        navigate('/signin');
      } else {
        setErrors({ general: result.error });
      }
    } catch (error) {
      console.error('Registration error:', error);
      if (error.message.includes('Rate limit') || error.message.includes('Too many')) {
        setErrors({ general: 'Too many attempts. Please wait before trying again.' });
      } else {
        setErrors({ general: 'Registration failed. Please try again.' });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="signup-page">
      <SignInHeader />
      <div className="signup-container">
        <div className="signup-form-container">
          <div className="form-header">
            <div className="paynow-icon">
              <img 
                src="/images/PayNow.png" 
                alt="PayNow" 
                className="icon-image"
              />
            </div>
            <h1 className="signup-title">PayNow</h1>
            <p className="signup-subtitle">Create Your Account</p>
          </div>
          
          <form className="signup-form" onSubmit={handleSubmit}>
            {errors.general && (
              <div className="error-message general-error">{errors.general}</div>
            )}
            
            <div className="form-group">
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                onBlur={handleBlur}
                required
                placeholder="Full Name"
                className={errors.fullName ? 'error' : ''}
              />
              {errors.fullName && (
                <div className="error-message">{errors.fullName}</div>
              )}
            </div>
            
            <div className="form-group">
              <input
                type="text"
                id="idNumber"
                name="idNumber"
                value={formData.idNumber}
                onChange={handleChange}
                onBlur={handleBlur}
                required
                placeholder="ID Number"
                className={errors.idNumber ? 'error' : ''}
              />
              {errors.idNumber && (
                <div className="error-message">{errors.idNumber}</div>
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
                className={errors.accountNumber ? 'error' : ''}
              />
              {errors.accountNumber && (
                <div className="error-message">{errors.accountNumber}</div>
              )}
            </div>
            
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
                className={errors.username ? 'error' : ''}
              />
              {errors.username && (
                <div className="error-message">{errors.username}</div>
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
                className={errors.password ? 'error' : ''}
              />
              {errors.password && (
                <div className="error-message">
                  {Array.isArray(errors.password) ? (
                    <ul>
                      {errors.password.map((error, index) => (
                        <li key={index}>{error}</li>
                      ))}
                    </ul>
                  ) : (
                    errors.password
                  )}
                </div>
              )}
            </div>
            
            <button 
              type="submit" 
              className="signup-button"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Creating Account...' : 'Sign Up'}
            </button>
            
            <div className="form-footer">
              <p>Already have an account? <Link to="/signin" className="signin-link">Sign In Here</Link></p>
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

export default SignUp;
