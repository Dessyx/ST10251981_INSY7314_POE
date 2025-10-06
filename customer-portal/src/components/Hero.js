import React from 'react';
import { Link } from 'react-router-dom';
import './Hero.css';

const Hero = () => {
  return (
    <section className="hero">
      <div className="hero-background">
        <img 
          src="/images/HeroImage.png" 
          alt="City skyline" 
          className="hero-image"
        />
      </div>
      <div className="hero-overlay"></div>
      <div className="hero-content">
        <h1 className="hero-title">
          Stay in control of your <span className="highlight">finances</span> with PayNow
        </h1>
        <Link to="/signin" className="cta-button">Get Started</Link>
      </div>
    </section>
  );
};

export default Hero;
