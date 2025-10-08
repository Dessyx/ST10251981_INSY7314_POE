# PayNow - Secure Payment Portal

A secure payment application with  for an internal international payment system. Customers often must make international payments via the bank’s online banking site.. A secure international payment system built with React frontend and Node.js/Express backend. Customers make payments via the banking site and employees check transactions and forward them to SWIFT for payment. 

---

## ✨ Features

### 🏦 Core Banking Features

- **Money Transfer** - Send money internationally with SWIFT code support
- **International Payments** - Support for multiple currencies (ZAR, USD, EUR, GBP)
- **Transaction History** - View all your past transactions with detailed information
- **Real-time Transaction Tracking** - Track payment status (pending, verified, completed)
- **Payment Confirmation** - Review and confirm transactions before submission
- **Transaction Dashboard** - Employee portal to verify and manage all transactions

### 👤 User Management

- **User Registration** - Secure account creation with validation
- **User Authentication** - Login with username and account number
- **Role-Based Access Control** - Customer and Employee roles with different permissions
- **Protected Routes** - Secure pages that require authentication
- **Profile Management** - View and manage account details

### 💳 Payment Processing

- **Multi-Currency Support** - Process payments in ZAR, USD, EUR, and GBP
- **SWIFT Code Validation** - Ensures correct international bank codes
- **Payment Amount Validation** - Secure input validation for transaction amounts
- **Recipient Information** - Add and validate recipient details
- **Payment Provider Selection** - Choose from multiple payment providers
- **Transaction Descriptions** - Add notes to your transactions

### 🎨 User Interface

- **Modern Responsive Design** - Works seamlessly on desktop, tablet, and mobile
- **Interactive Homepage** - Hero section with call-to-action buttons
- **About Us Page** - Company vision and goals
- **Feature Cards** - Visual representation of available services
- **Payment Success Page** - Confirmation of successful transactions
- **Transaction Tables** - Clean, organized view of transaction data

## 🚀 Quick Start

### 1. Install Dependencies

```bash
# Install root dependencies
npm install

# Install API server dependencies
cd api-server
npm install
cd ..

# Install customer portal dependencies
cd customer-portal
npm install
cd ..
```

### 2. Generate SSL Certificates

```bash
cd api-server
node generate-ssl-cert.js
cd ..
```

This creates SSL certificates in `api-server/ssl/` folder.

### 3. Setup HTTPS for React

```bash
cd customer-portal
node setup-https.js
cd ..
```

This creates a `.env` file with HTTPS configuration.

### 4. Run the Application

**Open two terminals:**

**Terminal 1 - Start API Server:**
```bash
cd api-server
npm start
```

**Terminal 2 - Start Customer Portal:**
```bash
cd customer-portal
npm start
```

### 5. Access the Application

- **Frontend:** https://localhost:3000
- **Backend:** https://localhost:4000

**First time:** You'll see a security warning. Click "Advanced" → "Proceed to localhost" (this is normal for local development).

---

## 🔓 Remove "Not Secure" Warning

To remove the browser warning and see the secure lock icon:

### 🪟 Windows (Chrome/Edge)

1. Navigate to your project folder: `PayNow\api-server\ssl\`
2. Find the file `cert.pem`
3. Rename `cert.pem` to `cert.crt` (just change the extension)
4. Double-click `cert.crt`
5. Click **Install Certificate**
6. Choose **Local Machine** or **Current User** → click **Next**
7. Select **Place all certificates in the following store** → click **Browse**
8. Choose **Trusted Root Certification Authorities**
9. Click **Next** → **Finish**
10. Restart your browser completely
11. Go to https://localhost:3000

✅ **Now your local HTTPS site should show a secure lock icon!**

### 🦊 Firefox

1. Go to https://localhost:3000
2. Click **Advanced** → **Accept the Risk and Continue**
3. Do the same for https://localhost:4000

### 🍎 macOS (Safari/Chrome)

1. Open Finder and go to `PayNow/api-server/ssl/`
2. Double-click `cert.pem`
3. Keychain Access opens → select **login** or **System** → click **Add**
4. Find the certificate in Keychain Access (search "localhost")
5. Double-click it → expand **Trust** section
6. Set **When using this certificate** to **Always Trust**
7. Close and enter your password
8. Restart your browser

### 🐧 Linux

```bash
cd api-server/ssl
sudo cp cert.pem /usr/local/share/ca-certificates/localhost.crt
sudo update-ca-certificates
```

Restart your browser.

---

## 🛡️ Security Features

- ✅ **HTTPS/SSL Encryption** - All data transmitted securely
- ✅ **JWT Authentication** - Token-based secure authentication
- ✅ **Bcrypt Password Hashing** - Passwords stored with salt and pepper
- ✅ **Rate Limiting** - Protection against brute force and DDoS attacks
- ✅ **XSS Protection** - Cross-site scripting prevention
- ✅ **CORS Configuration** - Controlled cross-origin resource sharing
- ✅ **Session Management** - Auto-logout after 30 minutes of inactivity
- ✅ **Session Timeout Warning** - 5-minute warning before session expires
- ✅ **Input Validation** - Server-side and client-side validation
- ✅ **Audit Logging** - All transactions and authentication events logged
- ✅ **Clickjacking Protection** - Frame busting and CSP headers
- ✅ **Secure Error Messages** - No credential enumeration
- ✅ **Timing Attack Prevention** - Random delays on authentication
- ✅ **Content Security Policy** - Prevents unauthorized resource loading
- ✅ **CSRF Protection** - Cross-site request forgery prevention


---

## 🧪 Accounts

After running the application, login with:

### Create Admin Account (First Time Setup)

Before logging in as an employee, run this command:

```bash
cd api-server
node seed-employees.js
cd ..
```

This creates the admin/employee account.

### Login Credentials

After running the application, login with:

**Customer Account:**
- Username: your own email
- Account Number: your own account number
- Password: your own password

**Employee Account:**
- Username: `admin`
- Account Number: `999999999999`
- Password: `Admin@123!`

---

## 🐛 Troubleshooting

### Problem: Certificate Error
**Solution:** Follow the [SSL trust instructions](#-remove-not-secure-warning) above

### Problem: Port already in use
**Solution:**
```bash
# Windows (PowerShell)
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# macOS/Linux
lsof -ti:3000 | xargs kill -9
```

### Problem: CORS errors
**Solution:**
- Make sure both servers are running
- Verify both use HTTPS (https://localhost:3000 and https://localhost:4000)

### Problem: Module not found
**Solution:**
```bash
# Reinstall all dependencies
cd api-server && npm install
cd ../customer-portal && npm install
```

---

## 📝 Environment Variables

### API Server
Create `.env` in `api-server/`:
```env
PORT=4000
JWT_SECRET=your-secret-key-here
NODE_ENV=development
```

### Customer Portal
Already created by `setup-https.js` in `customer-portal/.env`:
```env
REACT_APP_API_URL=https://localhost:4000
HTTPS=true
SSL_CRT_FILE=../api-server/ssl/cert.pem
SSL_KEY_FILE=../api-server/ssl/key.pem
```

---

## ⚠️ Important Notes

- **Development Only:** These SSL certificates are self-signed for local development

---

## 💡 Youtube Video
- link: 
