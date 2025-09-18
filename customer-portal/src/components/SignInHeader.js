import React from 'react';
import { Link } from 'react-router-dom';
import './SignInHeader.css';

const SignInHeader = () => {
  return (
    <header className="signin-header">
      <div className="signin-header-container">
        <div className="logo">
          <Link to="/">PayNow</Link>
        </div>
        <nav className="signin-nav">
          <Link to="/" className="logout-link">Logout</Link>
        </nav>
      </div>
    </header>
  );
};

export default SignInHeader;
