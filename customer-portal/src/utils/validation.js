// Validation utility functions for forms
import { sanitizeInput, validateSQLInput, encodeHTML } from './security';

export const validateEmail = (email) => {
  const sanitizedEmail = sanitizeInput(email);
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(sanitizedEmail);
};

export const validatePassword = (password) => {
  const minLength = 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  
  return {
    isValid: password.length >= minLength && hasUpperCase && hasLowerCase && hasNumbers && hasSpecialChar,
    errors: {
      minLength: password.length < minLength ? `Password must be at least ${minLength} characters` : null,
      hasUpperCase: !hasUpperCase ? 'Password must contain at least one uppercase letter' : null,
      hasLowerCase: !hasLowerCase ? 'Password must contain at least one lowercase letter' : null,
      hasNumbers: !hasNumbers ? 'Password must contain at least one number' : null,
      hasSpecialChar: !hasSpecialChar ? 'Password must contain at least one special character' : null
    }
  };
};

export const validateFullName = (name) => {
  const sanitizedName = sanitizeInput(name);
  
  // Check for SQL injection attempts
  if (!validateSQLInput(sanitizedName)) {
    return {
      isValid: false,
      error: 'Invalid characters detected in name'
    };
  }
  
  const nameRegex = /^[a-zA-Z\s]{2,50}$/;
  return {
    isValid: nameRegex.test(sanitizedName.trim()),
    error: !nameRegex.test(sanitizedName.trim()) ? 'Full name must be 2-50 characters and contain only letters and spaces' : null
  };
};

export const validateIdNumber = (idNumber) => {
  const sanitizedId = sanitizeInput(idNumber);
  
  // Check for SQL injection attempts
  if (!validateSQLInput(sanitizedId)) {
    return {
      isValid: false,
      error: 'Invalid characters detected in ID number'
    };
  }
  
  // Assuming ID numbers are 8-12 digits
  const idRegex = /^\d{8,12}$/;
  return {
    isValid: idRegex.test(sanitizedId),
    error: !idRegex.test(sanitizedId) ? 'ID number must be 8-12 digits' : null
  };
};

export const validateAccountNumber = (accountNumber) => {
  const sanitizedAccount = sanitizeInput(accountNumber);
  
  // Check for SQL injection attempts
  if (!validateSQLInput(sanitizedAccount)) {
    return {
      isValid: false,
      error: 'Invalid characters detected in account number'
    };
  }
  
  // Assuming account numbers are 8-16 digits
  const accountRegex = /^\d{8,16}$/;
  return {
    isValid: accountRegex.test(sanitizedAccount),
    error: !accountRegex.test(sanitizedAccount) ? 'Account number must be 8-16 digits' : null
  };
};

export const validateUsername = (username) => {
  const sanitizedUsername = sanitizeInput(username);
  
  // Check for SQL injection attempts
  if (!validateSQLInput(sanitizedUsername)) {
    return {
      isValid: false,
      error: 'Invalid characters detected in username'
    };
  }
  
  const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
  return {
    isValid: usernameRegex.test(sanitizedUsername),
    error: !usernameRegex.test(sanitizedUsername) ? 'Username must be 3-20 characters and contain only letters, numbers, and underscores' : null
  };
};

export const validateRequired = (value, fieldName) => {
  return {
    isValid: value.trim().length > 0,
    error: value.trim().length === 0 ? `${fieldName} is required` : null
  };
};

// Form validation functions
export const validateSignUpForm = (formData) => {
  const errors = {};
  let isValid = true;

  // Full Name validation
  const fullNameValidation = validateFullName(formData.fullName);
  if (!fullNameValidation.isValid) {
    errors.fullName = fullNameValidation.error;
    isValid = false;
  }

  // ID Number validation
  const idNumberValidation = validateIdNumber(formData.idNumber);
  if (!idNumberValidation.isValid) {
    errors.idNumber = idNumberValidation.error;
    isValid = false;
  }

  // Account Number validation
  const accountNumberValidation = validateAccountNumber(formData.accountNumber);
  if (!accountNumberValidation.isValid) {
    errors.accountNumber = accountNumberValidation.error;
    isValid = false;
  }

  // Password validation
  const passwordValidation = validatePassword(formData.password);
  if (!passwordValidation.isValid) {
    errors.password = Object.values(passwordValidation.errors).filter(error => error !== null);
    isValid = false;
  }

  return { isValid, errors };
};

export const validateSignInForm = (formData) => {
  const errors = {};
  let isValid = true;

  // Username validation
  const usernameValidation = validateUsername(formData.username);
  if (!usernameValidation.isValid) {
    errors.username = usernameValidation.error;
    isValid = false;
  }

  // Account Number validation
  const accountNumberValidation = validateAccountNumber(formData.accountNumber);
  if (!accountNumberValidation.isValid) {
    errors.accountNumber = accountNumberValidation.error;
    isValid = false;
  }

  // Password validation (basic required check)
  const passwordRequired = validateRequired(formData.password, 'Password');
  if (!passwordRequired.isValid) {
    errors.password = passwordRequired.error;
    isValid = false;
  }

  return { isValid, errors };
};

// Payment form validation functions
export const validateAmount = (amount) => {
  const sanitizedAmount = sanitizeInput(amount);
  
  if (!validateSQLInput(sanitizedAmount)) {
    return {
      isValid: false,
      error: 'Invalid characters detected in amount'
    };
  }
  
  const amountRegex = /^\d+(\.\d{1,2})?$/;
  const numericAmount = parseFloat(sanitizedAmount);
  
  if (!amountRegex.test(sanitizedAmount)) {
    return {
      isValid: false,
      error: 'Amount must be a valid number (e.g., 100.50)'
    };
  }
  
  if (numericAmount <= 0) {
    return {
      isValid: false,
      error: 'Amount must be greater than 0'
    };
  }
  
  if (numericAmount > 1000000) {
    return {
      isValid: false,
      error: 'Amount cannot exceed R1,000,000'
    };
  }
  
  return {
    isValid: true,
    error: null
  };
};

export const validateCurrency = (currency) => {
  const sanitizedCurrency = sanitizeInput(currency);
  
  if (!validateSQLInput(sanitizedCurrency)) {
    return {
      isValid: false,
      error: 'Invalid characters detected in currency'
    };
  }
  
  const supportedCurrencies = ['ZAR', 'USD', 'EUR', 'GBP'];
  const isValidCurrency = supportedCurrencies.includes(sanitizedCurrency.toUpperCase());
  
  return {
    isValid: isValidCurrency,
    error: !isValidCurrency ? 'Currency must be one of: ZAR, USD, EUR, GBP' : null
  };
};

export const validateRecipient = (recipient) => {
  const sanitizedRecipient = sanitizeInput(recipient);
  
  if (!validateSQLInput(sanitizedRecipient)) {
    return {
      isValid: false,
      error: 'Invalid characters detected in recipient name'
    };
  }
  
  const recipientRegex = /^[a-zA-Z\s]{2,50}$/;
  return {
    isValid: recipientRegex.test(sanitizedRecipient.trim()),
    error: !recipientRegex.test(sanitizedRecipient.trim()) ? 'Recipient name must be 2-50 characters and contain only letters and spaces' : null
  };
};

export const validateProvider = (provider) => {
  const sanitizedProvider = sanitizeInput(provider);
  
  if (!validateSQLInput(sanitizedProvider)) {
    return {
      isValid: false,
      error: 'Invalid characters detected in provider name'
    };
  }
  
  const providerRegex = /^[a-zA-Z\s]{2,50}$/;
  return {
    isValid: providerRegex.test(sanitizedProvider.trim()),
    error: !providerRegex.test(sanitizedProvider.trim()) ? 'Provider name must be 2-50 characters and contain only letters and spaces' : null
  };
};

export const validateSwiftCode = (swiftCode) => {
  const sanitizedSwift = sanitizeInput(swiftCode);
  
  if (!validateSQLInput(sanitizedSwift)) {
    return {
      isValid: false,
      error: 'Invalid characters detected in SWIFT code'
    };
  }
  
  // SWIFT code format: 8 or 11 characters (letters and numbers)
  const swiftRegex = /^[A-Z]{6}[A-Z0-9]{2}([A-Z0-9]{3})?$/;
  return {
    isValid: swiftRegex.test(sanitizedSwift.toUpperCase()),
    error: !swiftRegex.test(sanitizedSwift.toUpperCase()) ? 'SWIFT code must be 8 or 11 characters (e.g., SBZAZAJJ or SBZAZAJJXXX)' : null
  };
};

export const validatePaymentForm = (formData) => {
  const errors = {};
  let isValid = true;

  // Amount validation
  const amountValidation = validateAmount(formData.amount);
  if (!amountValidation.isValid) {
    errors.amount = amountValidation.error;
    isValid = false;
  }

  // Currency validation
  const currencyValidation = validateCurrency(formData.currency);
  if (!currencyValidation.isValid) {
    errors.currency = currencyValidation.error;
    isValid = false;
  }

  // Recipient validation
  const recipientValidation = validateRecipient(formData.recipient);
  if (!recipientValidation.isValid) {
    errors.recipient = recipientValidation.error;
    isValid = false;
  }

  // Provider validation
  const providerValidation = validateProvider(formData.provider);
  if (!providerValidation.isValid) {
    errors.provider = providerValidation.error;
    isValid = false;
  }

  // SWIFT code validation
  const swiftValidation = validateSwiftCode(formData.swiftCode);
  if (!swiftValidation.isValid) {
    errors.swiftCode = swiftValidation.error;
    isValid = false;
  }

  return { isValid, errors };
};