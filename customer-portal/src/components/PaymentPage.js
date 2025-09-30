import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './PaymentPage.css';
import paymentIcon from '../assets/payment-icon.png';
import { validatePaymentForm, validateAmount, validateCurrency, validateRecipient, validateProvider, validateSwiftCode } from '../utils/validation';
import PaymentService from '../services/paymentService';

const PaymentPage = ({ currentPage, setCurrentPage }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const editData = location.state?.editData;

  // Form state
  const [formData, setFormData] = useState({
    amount: '',
    currency: 'ZAR',
    recipient: '',
    provider: '',
    swiftCode: '',
    description: ''
  });

  // Validation state
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState('');

  // Load edit data if available
  useEffect(() => {
    if (editData) {
      // Convert sanitized data back to form format
      const formCompatibleData = {
        amount: editData.amount || '',
        currency: editData.currency || 'ZAR',
        recipient: editData.recipient || '',
        provider: editData.provider || '',
        swiftCode: editData.swift_code || editData.swiftCode || '', // Handle both property names
        description: editData.description || ''
      };
      setFormData(formCompatibleData);
    }
  }, [editData]);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Handle input blur (field validation)
  const handleInputBlur = (e) => {
    const { name, value } = e.target;
    setTouched(prev => ({
      ...prev,
      [name]: true
    }));

    // Validate individual field
    let error = '';
    switch (name) {
      case 'amount':
        error = validateAmount(value).error || '';
        break;
      case 'currency':
        error = validateCurrency(value).error || '';
        break;
      case 'recipient':
        error = validateRecipient(value).error || '';
        break;
      case 'provider':
        error = validateProvider(value).error || '';
        break;
      case 'swiftCode':
        error = validateSwiftCode(value).error || '';
        break;
      default:
        break;
    }

    setErrors(prev => ({
      ...prev,
      [name]: error
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setApiError('');

    // Mark all fields as touched
    const allTouched = {};
    Object.keys(formData).forEach(key => {
      allTouched[key] = true;
    });
    setTouched(allTouched);

    // Validate entire form
    const validation = validatePaymentForm(formData);
    
    if (!validation.isValid) {
      setErrors(validation.errors);
      setIsSubmitting(false);
      return;
    }

    // Clear any existing errors
    setErrors({});

    try {
      // Prepare payment data for API
      const sanitizedData = PaymentService.sanitizePaymentData({
        ...formData,
        amount: parseFloat(formData.amount).toFixed(2),
        userId: 1 // Default user ID for demo
      });


      // Navigate to confirmation page with form data
      navigate('/confirmation', { 
        state: { 
          paymentData: sanitizedData
        } 
      });
    } catch (error) {
      console.error('Form submission error:', error);
      setApiError('Failed to process payment. Please try again.');
      setIsSubmitting(false);
    }
  };

  // Check if form is valid
  const isFormValid = Object.values(errors).every(error => !error) && 
                     Object.values(formData).every(value => {
                       if (typeof value === 'string') {
                         return value.trim() !== '';
                       }
                       return value !== '' && value != null;
                     });

  return (
    <div className="payment-page">
      {/* Simple Header */}
      <header className="simple-header">
        <div className="header-content">
          <div className="header-left">
            <h1 className="logo">PayNow</h1>
          </div>
          <div className="header-right">
            <button 
              className="back-button"
              onClick={() => navigate('/TransactionHistory')}
            >
              ← Back to History
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="main-content">
        <div className="payment-card">
          {/* Payment Icon */}
          <div className="payment-icon">
            <img src={paymentIcon} alt="Payment Icon" />
          </div>
          
          {/* Welcome Message */}
          <h2 className="welcome-message">Welcome, User!</h2>
          <p className="welcome-subtitle">Securely make a transaction</p>
          
          {/* Payment Form */}
          <form className="payment-form" onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-column">
                <div className="form-group">
                  <label htmlFor="amount">Amount *</label>
                  <input 
                    type="text" 
                    id="amount" 
                    name="amount" 
                    value={formData.amount}
                    onChange={handleInputChange}
                    onBlur={handleInputBlur}
                    className={touched.amount && errors.amount ? 'input-error' : ''}
                    placeholder="e.g., 100.50"
                  />
                  {touched.amount && errors.amount && (
                    <span className="error-message">{errors.amount}</span>
                  )}
                </div>
                <div className="form-group">
                  <label htmlFor="provider">Provider *</label>
                  <input 
                    type="text" 
                    id="provider" 
                    name="provider" 
                    value={formData.provider}
                    onChange={handleInputChange}
                    onBlur={handleInputBlur}
                    className={touched.provider && errors.provider ? 'input-error' : ''}
                    placeholder="e.g., Standard Bank"
                  />
                  {touched.provider && errors.provider && (
                    <span className="error-message">{errors.provider}</span>
                  )}
                </div>
              </div>
              
              <div className="form-column">
                <div className="form-group">
                  <label htmlFor="currency">Currency *</label>
                  <select 
                    id="currency" 
                    name="currency" 
                    value={formData.currency}
                    onChange={handleInputChange}
                    onBlur={handleInputBlur}
                    className={touched.currency && errors.currency ? 'input-error' : ''}
                  >
                    <option value="ZAR">ZAR (South African Rand)</option>
                    <option value="USD">USD (US Dollar)</option>
                    <option value="EUR">EUR (Euro)</option>
                    <option value="GBP">GBP (British Pound)</option>
                  </select>
                  {touched.currency && errors.currency && (
                    <span className="error-message">{errors.currency}</span>
                  )}
                </div>
                <div className="form-group">
                  <label htmlFor="recipient">Recipient *</label>
                  <input 
                    type="text" 
                    id="recipient" 
                    name="recipient" 
                    value={formData.recipient}
                    onChange={handleInputChange}
                    onBlur={handleInputBlur}
                    className={touched.recipient && errors.recipient ? 'input-error' : ''}
                    placeholder="e.g., John Smith"
                  />
                  {touched.recipient && errors.recipient && (
                    <span className="error-message">{errors.recipient}</span>
                  )}
                </div>
              </div>
            </div>
            
            <div className="form-group full-width">
              <label htmlFor="swift-code">SWIFT Code *</label>
              <input 
                type="text" 
                id="swift-code" 
                name="swiftCode" 
                value={formData.swiftCode}
                onChange={handleInputChange}
                onBlur={handleInputBlur}
                className={touched.swiftCode && errors.swiftCode ? 'input-error' : ''}
                placeholder="e.g., SBZAZAJJ or SBZAZAJJXXX"
                style={{ textTransform: 'uppercase' }}
              />
              {touched.swiftCode && errors.swiftCode && (
                <span className="error-message">{errors.swiftCode}</span>
              )}
            </div>

            <div className="form-group full-width">
              <label htmlFor="description">Description (Optional)</label>
              <input 
                type="text" 
                id="description" 
                name="description" 
                value={formData.description}
                onChange={handleInputChange}
                onBlur={handleInputBlur}
                className={touched.description && errors.description ? 'input-error' : ''}
                placeholder="Payment description or reference"
              />
              {touched.description && errors.description && (
                <span className="error-message">{errors.description}</span>
              )}
            </div>
            
            {/* API Error Display */}
            {apiError && (
              <div className="api-error">
                <span className="error-message">{apiError}</span>
              </div>
            )}

            <button 
              type="submit" 
              className={`paynow-button ${!isFormValid || isSubmitting ? 'disabled' : ''}`}
              disabled={!isFormValid || isSubmitting}
            >
              {isSubmitting ? 'Processing...' : 'Continue to Confirmation'}
            </button>
          </form>
        </div>
      </main>

      {/* Footer */}
      <footer className="footer">
        <p>&copy; 2025- PayNow All rights reserved</p>
      </footer>
    </div>
  );
};

export default PaymentPage;
