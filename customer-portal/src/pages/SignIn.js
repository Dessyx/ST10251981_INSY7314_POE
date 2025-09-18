import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import SignInHeader from '../components/SignInHeader';
import './SignIn.css';

const SignIn = () => {
  const [formData, setFormData] = useState({
    username: '',
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
    console.log('Sign in:', formData);
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
              <div className="form-group">
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                  placeholder="Username"
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
              
              <button type="submit" className="signin-button">
                Log In
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
