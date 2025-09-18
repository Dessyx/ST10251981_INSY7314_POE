import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

const Header = () => {
  return (
    <header className="header">
      <div className="header-container">
        <div className="logo">
          <Link to="/">PayNow</Link>
        </div>
        <nav className="nav">
          <Link to="/signin" className="nav-link">Login</Link>
          <Link to="/signup" className="nav-link">Sign Up</Link>
          <div className="user-icon">
            <img 
              src="/images/Profile.png" 
              alt="User Profile" 
              className="profile-image"
            />
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;
