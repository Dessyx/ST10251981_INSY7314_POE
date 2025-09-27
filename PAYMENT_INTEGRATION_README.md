# PayNow Payment Integration

This document describes the complete payment integration between the frontend React application and the backend API server.

## Features Implemented

### ✅ Backend API Enhancements
- **Enhanced Security**: Added Helmet, rate limiting, CSRF protection, and input sanitization
- **Complete Transaction API**: Full CRUD operations with validation
- **Database Integration**: SQLite database with proper schema and migrations
- **Error Handling**: Comprehensive error handling and logging
- **Input Validation**: Server-side validation using express-validator

### ✅ Frontend Integration
- **Payment Service**: Complete API integration service
- **Real-time Data**: Live transaction history from database
- **Error Handling**: User-friendly error messages and loading states
- **Form Validation**: Client-side and server-side validation
- **Security Headers**: CSRF protection and secure API calls

### ✅ Transaction Flow
1. **Payment Form** → User fills payment details
2. **Validation** → Client and server-side validation
3. **Confirmation** → User reviews and confirms payment
4. **API Call** → Transaction saved to database
5. **Success Page** → Real transaction data displayed
6. **History** → Live transaction history from database

## Setup Instructions

### 1. Backend Setup

```bash
cd api-server

# Install dependencies
npm install

# Run database migrations
npx knex migrate:latest

# Seed sample data (optional)
node seed-transactions.js

# Start the server
npm start
# Server will run on http://localhost:4000
```

### 2. Frontend Setup

```bash
cd customer-portal

# Install dependencies
npm install

# Start the development server
npm start
# App will run on http://localhost:3000
```

## API Endpoints

### Transactions
- `GET /transactions` - Get all transactions (with filtering)
- `GET /transactions/:id` - Get specific transaction
- `POST /transactions` - Create new transaction
- `PATCH /transactions/:id` - Update transaction status

### Health Check
- `GET /health` - Server health status

## Security Features

### Rate Limiting
- **General API**: 100 requests per 15 minutes per IP
- **Payment Creation**: 10 requests per 15 minutes per IP
- **Transaction History**: 20 requests per 5 minutes per IP

### Security Headers
- Content Security Policy (CSP)
- X-Frame-Options: DENY
- X-XSS-Protection
- HSTS (HTTP Strict Transport Security)
- CSRF Protection via X-Requested-With header

### Input Validation & Sanitization
- Server-side validation using express-validator
- Input sanitization to prevent XSS
- SQL injection prevention via parameterized queries
- Request logging for audit trails

## Database Schema

### Transactions Table
```sql
CREATE TABLE transactions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  amount DECIMAL(14,2) NOT NULL,
  currency VARCHAR(3) NOT NULL,
  swift_code VARCHAR(11),
  recipient_name VARCHAR(100),
  provider VARCHAR(100),
  status VARCHAR(20) DEFAULT 'pending',
  description TEXT DEFAULT '',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);
```

## Testing the Integration

### 1. Create a Payment
1. Navigate to the Payment Page
2. Fill in the form with valid data:
   - Amount: 100.50
   - Currency: ZAR
   - Recipient: John Doe
   - Provider: Standard Bank
   - SWIFT Code: SBZAZAJJ
3. Click "Continue to Confirmation"
4. Review details and click "Confirm Payment"
5. You should see the success page with real transaction data

### 2. View Transaction History
1. Navigate to Transaction History
2. You should see all transactions from the database
3. Use the date filter to filter transactions
4. Each transaction shows real data with timestamps

### 3. Test Security Features
1. Try making multiple rapid payment requests (should be rate limited)
2. Check browser developer tools for security headers
3. Try submitting invalid data (should be rejected)

## Environment Configuration

Create a `.env` file in the customer-portal directory:
```env
REACT_APP_API_URL=http://localhost:4000
REACT_APP_ENABLE_SECURITY_CHECKS=true
```

## Troubleshooting

### Common Issues

1. **CORS Errors**
   - Ensure the API server is running on port 4000
   - Check that the frontend is running on port 3000
   - Verify CORS configuration in server.js

2. **Database Errors**
   - Run migrations: `npx knex migrate:latest`
   - Check database file permissions
   - Ensure SQLite3 is installed

3. **Rate Limiting**
   - Wait for the rate limit window to reset
   - Check rate limit headers in response
   - Adjust limits in security middleware if needed

4. **Validation Errors**
   - Check browser console for validation messages
   - Verify required fields are filled
   - Ensure SWIFT code format is correct (8 or 11 characters)

## Security Considerations

- All API calls include CSRF protection
- Input is sanitized to prevent XSS attacks
- Rate limiting prevents abuse
- Sensitive operations are logged for audit
- Database queries use parameterized statements
- Security headers protect against common attacks

## Performance Notes

- Transactions are paginated for large datasets
- Rate limiting prevents server overload
- Database queries are optimized with proper indexing
- Error handling prevents application crashes

## Future Enhancements

- User authentication and authorization
- Real payment gateway integration
- Email notifications
- Advanced reporting and analytics
- Multi-currency support
- Transaction receipts and invoices
