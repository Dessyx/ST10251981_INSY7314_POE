import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import SignInHeader from '../components/SignInHeader';
import './SignUp.css';

const SignUp = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    idNumber: '',
    accountNumber: '',
    password: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle sign up logic here
    console.log('Sign up:', formData);
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
                required
                placeholder="Full Name"
              />
            </div>
            
            <div className="form-group">
              <input
                type="text"
                id="idNumber"
                name="idNumber"
                value={formData.idNumber}
                onChange={handleChange}
                required
                placeholder="ID Number"
              />
            </div>
            
            <div className="form-group">
              <input
                type="text"
                id="accountNumber"
                name="accountNumber"
                value={formData.accountNumber}
                onChange={handleChange}
                required
                placeholder="Account Number"
              />
            </div>
            
            <div className="form-group">
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="Password"
              />
            </div>
            
            <button type="submit" className="signup-button">
              Sign Up
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
