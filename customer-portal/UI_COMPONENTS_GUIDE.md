# PayNow Static UI Components

This document provides a guide for the static UI components created for the PayNow payments application.

## Overview

Three main UI components have been created to match the design specifications:

1. **PaymentPage** - The main payment form where users enter transaction details
2. **PaymentSuccess** - The success page shown after a successful payment
3. **TransactionDashboard** - The staff dashboard for managing pending and verified transactions

## File Structure

```
src/
├── components/
│   ├── PaymentPage.js
│   ├── PaymentPage.css
│   ├── PaymentSuccess.js
│   ├── PaymentSuccess.css
│   ├── TransactionDashboard.js
│   └── TransactionDashboard.css
├── App.js (updated to showcase all components)
└── App.css (updated with test navigation styles)
```

## How to Run and View Components

### Prerequisites
- Node.js installed
- npm package manager

### Steps to Run

1. **Navigate to the customer-portal directory:**
   ```bash
   cd C:\Users\lab_services_student\Desktop\PayNow\ST10251981_INSY7314_Part2\customer-portal
   ```

2. **Install dependencies (if not already done):**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm start
   ```

4. **Open your browser and navigate to:**
   ```
   http://localhost:3000
   ```

### Testing All Components

The app includes a test navigation bar in the top-right corner with three buttons:
- **Payment Page** - Shows the payment form
- **Success Page** - Shows the payment success page
- **Dashboard** - Shows the transaction dashboard

Click these buttons to switch between different components and test the UI.

## Component Details

### 1. PaymentPage Component

**Features:**
- Clean, minimalist design with blue and white color scheme
- Header with PayNow logo and user icon
- Payment form with two-column layout:
  - Left column: Amount, Provider, SWIFT code
  - Right column: Currency, Recipient
- Large PayNow button for form submission
- Footer with copyright notice

**Form Fields:**
- Amount
- Provider
- Currency
- Recipient
- SWIFT code (full width)

### 2. PaymentSuccess Component

**Features:**
- Success confirmation with blue circular checkmark icon
- "Payment Successful!" heading
- Transaction details box showing:
  - Transaction Number: #1234532
  - Amount: R100.00
  - Date: September 26, 2025
  - Status: Completed
- Two action buttons:
  - "Return to Dashboard" (primary blue button)
  - "Make Another Payment" (secondary gray button)

### 3. TransactionDashboard Component

**Features:**
- Header with PayNow logo, page title, and logout functionality
- Two main sections divided by a vertical line:
  - **Pending Transactions** (left side)
  - **Verified Transactions** (right side)
- Each section has status labels with appropriate colors:
  - Pending: Orange background
  - Verified: Green background
- Transaction cards in 2x2 grid layout
- Action buttons for each transaction:
  - Pending: "Verify" button
  - Verified: "Verified" status button + "Submit to SWIFT" button
- "Submit all to SWIFT" button for bulk operations

## Design Specifications

### Color Scheme
- Primary Blue: #007bff
- Success Green: #28a745
- Warning Orange: #ffc107
- Danger Red: #dc3545
- Gray tones: #6c757d, #e9ecef, #f8f9fa

### Typography
- Font Family: Arial, sans-serif
- Headings: Bold, various sizes
- Body text: Regular weight
- Labels: Medium weight

### Layout
- Responsive design with mobile breakpoints
- Grid layouts for transaction cards
- Flexbox for alignment and spacing
- Card-based design with subtle shadows

## Responsive Design

All components are fully responsive and will adapt to different screen sizes:
- Desktop: Full two-column layouts
- Tablet: Adjusted spacing and single-column grids
- Mobile: Stacked layouts with optimized touch targets

## Next Steps for Integration

When integrating with backend functionality:

1. **Remove test navigation** from App.js
2. **Add routing** (React Router) for proper navigation
3. **Connect form handlers** for payment submission
4. **Add state management** for transaction data
5. **Implement authentication** for staff dashboard access
6. **Add API calls** for real transaction data

## Notes

- All components are purely static (no functionality)
- Form inputs are ready for integration with form handlers
- Buttons are styled but need click handlers
- Transaction data is hardcoded for demonstration
- Icons use emoji characters (can be replaced with proper icon libraries)

## Customization

The components can be easily customized by:
- Modifying CSS variables for colors
- Adjusting spacing and sizing in CSS files
- Changing form field layouts
- Updating button styles and text
- Adding or removing transaction fields
