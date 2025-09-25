import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import SignInHeader from '../components/SignInHeader';
import { validateSignUpForm } from '../utils/validation';
import { protectFormSubmission } from '../utils/ddosProtection';
import './SignUp.css';

const SignUp = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    idNumber: '',
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
      protectFormSubmission(formData, 'signup');
      
      // Validate form
      const validation = validateSignUpForm(formData);
      
      if (!validation.isValid) {
        setErrors(validation.errors);
        setIsSubmitting(false);
        return;
      }

      // Here you would typically make an API call to register the user
      console.log('Sign up:', formData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Reset form on success
      setFormData({
        fullName: '',
        idNumber: '',
        accountNumber: '',
        password: ''
      });
      setErrors({});
      setTouched({});
      
      alert('Account created successfully!');
    } catch (error) {
      console.error('Registration error:', error);
      if (error.message.includes('Rate limit') || error.message.includes('Too many')) {
        alert('Too many attempts. Please wait before trying again.');
      } else {
        alert('Registration failed. Please try again.');
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
                className={errors.fullName && touched.fullName ? 'error' : ''}
              />
              {errors.fullName && touched.fullName && (
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
                className={errors.idNumber && touched.idNumber ? 'error' : ''}
              />
              {errors.idNumber && touched.idNumber && (
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
