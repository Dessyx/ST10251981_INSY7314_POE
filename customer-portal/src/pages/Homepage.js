import React from 'react';
import Header from '../components/Header';
import Hero from '../components/Hero';
import Features from '../components/Features';
import AboutUs from '../components/AboutUs';

const Homepage = () => {
  return (
    <div className="homepage">
      <Header />
      <Hero />
      <Features />
      <AboutUs />
    </div>
  );
};

export default Homepage;
