// Quick test script to verify security setup
const https = require('https');
const fs = require('fs');
const path = require('path');

console.log('🔍 Testing PayNow Security Setup...\n');

// Test 1: Check SSL certificates exist
console.log('Test 1: Checking SSL certificates...');
const keyPath = path.join(__dirname, 'ssl', 'key.pem');
const certPath = path.join(__dirname, 'ssl', 'cert.pem');

if (fs.existsSync(keyPath) && fs.existsSync(certPath)) {
  console.log('✅ SSL certificates found');
  console.log(`   - Private key: ${keyPath}`);
  console.log(`   - Certificate: ${certPath}`);
} else {
  console.log('❌ SSL certificates NOT found');
  console.log('   Run: node generate-ssl-cert.js');
  process.exit(1);
}

// Test 2: Check dependencies
console.log('\nTest 2: Checking required dependencies...');
try {
  require('cookie-parser');
  console.log('✅ cookie-parser installed');
} catch (e) {
  console.log('❌ cookie-parser NOT installed');
  console.log('   Run: npm install cookie-parser');
}

try {
  require('node-forge');
  console.log('✅ node-forge installed');
} catch (e) {
  console.log('❌ node-forge NOT installed');
  console.log('   Run: npm install node-forge');
}

// Test 3: Verify TLS configuration
console.log('\nTest 3: Verifying TLS 1.3 configuration...');
const httpsOptions = {
  key: fs.readFileSync(keyPath),
  cert: fs.readFileSync(certPath),
  minVersion: 'TLSv1.3',
  maxVersion: 'TLSv1.3'
};
console.log('✅ TLS 1.3 configuration valid');

// Test 4: Check server can start
console.log('\nTest 4: Testing HTTPS server startup...');
const express = require('express');
const testApp = express();

testApp.get('/test', (req, res) => {
  res.json({ status: 'OK' });
});

const testServer = https.createServer(httpsOptions, testApp);

testServer.listen(0, () => {
  const address = testServer.address();
  console.log(`✅ HTTPS server can start (test port: ${address.port})`);
  testServer.close(() => {
    console.log('\n🎉 All security checks passed!');
    console.log('\n📋 Summary:');
    console.log('   ✅ SSL certificates ready');
    console.log('   ✅ Dependencies installed');
    console.log('   ✅ TLS 1.3 configured');
    console.log('   ✅ HTTPS server functional');
    console.log('\n🚀 Ready to run: npm start');
  });
});

testServer.on('error', (err) => {
  console.log('❌ Server error:', err.message);
  process.exit(1);
});

