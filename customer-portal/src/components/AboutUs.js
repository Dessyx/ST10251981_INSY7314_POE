import React from 'react';
import './AboutUs.css';

const AboutUs = () => {
  const goalsIcon = (
    <img 
      src="/images/GoalIcon.png" 
      alt="Goals" 
      className="about-icon-image"
    />
  );

  const visionIcon = (
    <img 
      src="/images/VisionIcon.png" 
      alt="Vision" 
      className="about-icon-image"
    />
  );

  return (
    <section className="about-us">
      <div className="about-container">
        <h2 className="about-title">About Us</h2>
        <div className="about-content">
          <div className="about-graphic">
            <img 
              src="/images/AboutUs.png" 
              alt="Mobile banking illustration" 
              className="about-image"
            />
          </div>
          <div className="about-text">
            <div className="text-block">
              <div className="text-icon">{goalsIcon}</div>
              <div className="text-content">
                <h3>Our Goals</h3>
                <p>To provide customers with secure, fast, and reliable banking services by leveraging SWIFT for seamless international transactions.</p>
              </div>
            </div>
            <div className="text-block">
              <div className="text-icon">{visionIcon}</div>
              <div className="text-content">
                <h3>Our Vision</h3>
                <p>To be a trusted digital-first bank that empowers individuals and businesses with innovative, borderless financial solutions.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;
