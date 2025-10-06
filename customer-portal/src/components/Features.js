import React from 'react';
import { Link } from 'react-router-dom';
import FeatureCard from './FeatureCard';
import './Features.css';

const Features = () => {
  const moneyTransferIcon = (
    <img 
      src="/images/MoneyTransfer.png" 
      alt="Money Transfer" 
      className="feature-icon-image"
    />
  );

  const bankDepositIcon = (
    <img 
      src="/images/BankDeposit.png" 
      alt="Bank Deposit" 
      className="feature-icon-image"
    />
  );

  const onlinePaymentIcon = (
    <img 
      src="/images/OnlinePayment.png" 
      alt="Online Payment" 
      className="feature-icon-image"
    />
  );

  return (
    <section className="features">
      <div className="features-container">
        <Link to="/signin" className="feature-link">
          <FeatureCard 
            icon={moneyTransferIcon} 
            title="Money transfer" 
            isHighlighted={true}
          />
        </Link>
        <FeatureCard 
          icon={bankDepositIcon} 
          title="Bank Deposit" 
        />
        <FeatureCard 
          icon={onlinePaymentIcon} 
          title="Online Payment" 
        />
      </div>
    </section>
  );
};

export default Features;
