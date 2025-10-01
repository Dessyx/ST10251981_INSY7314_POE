// Script to create .env file for HTTPS support in React
const fs = require('fs');
const path = require('path');

const envContent = `# API Configuration
REACT_APP_API_URL=https://localhost:4000

# Enable HTTPS for React development server
HTTPS=true
SSL_CRT_FILE=../api-server/ssl/cert.pem
SSL_KEY_FILE=../api-server/ssl/key.pem

# Environment
NODE_ENV=development
`;

const envPath = path.join(__dirname, '.env');

console.log('🔧 Setting up HTTPS for React development server...\n');

// Check if SSL certificates exist
const certPath = path.join(__dirname, '..', 'api-server', 'ssl', 'cert.pem');
const keyPath = path.join(__dirname, '..', 'api-server', 'ssl', 'key.pem');

if (!fs.existsSync(certPath) || !fs.existsSync(keyPath)) {
  console.error('❌ SSL certificates not found!');
  console.error('   Please run: cd ../api-server && node generate-ssl-cert.js');
  process.exit(1);
}

console.log('✅ SSL certificates found');

// Create or update .env file
try {
  fs.writeFileSync(envPath, envContent);
  console.log('✅ Created .env file with HTTPS configuration');
  console.log(`   Location: ${envPath}`);
  console.log('\n📋 Configuration:');
  console.log('   - HTTPS: Enabled');
  console.log('   - Frontend URL: https://localhost:3000');
  console.log('   - API URL: https://localhost:4000');
  console.log('   - Using shared SSL certificates');
  console.log('\n🚀 Next steps:');
  console.log('   1. Restart your React development server');
  console.log('   2. Navigate to https://localhost:3000 (note the HTTPS)');
  console.log('   3. Accept the certificate warning (same as before)');
  console.log('   4. Your secure cookies will now work! 🎉');
} catch (error) {
  console.error('❌ Failed to create .env file:', error.message);
  console.log('\n📝 Manual setup required:');
  console.log('   Create a file named ".env" in customer-portal/ with this content:');
  console.log('\n' + envContent);
  process.exit(1);
}

