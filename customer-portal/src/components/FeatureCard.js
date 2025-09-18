import React from 'react';
import './FeatureCard.css';

const FeatureCard = ({ icon, title, isHighlighted = false }) => {
  return (
    <div className={`feature-card ${isHighlighted ? 'highlighted' : ''}`}>
      <div className="feature-icon">
        {icon}
      </div>
      <h3 className="feature-title">{title}</h3>
    </div>
  );
};

export default FeatureCard;
