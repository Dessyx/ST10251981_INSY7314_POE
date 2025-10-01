// Script to generate self-signed SSL certificates for local development
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const certDir = path.join(__dirname, 'ssl');

// Create ssl directory if it doesn't exist
if (!fs.existsSync(certDir)) {
  fs.mkdirSync(certDir, { recursive: true });
}

const keyPath = path.join(certDir, 'key.pem');
const certPath = path.join(certDir, 'cert.pem');

// Check if certificates already exist
if (fs.existsSync(keyPath) && fs.existsSync(certPath)) {
  console.log('SSL certificates already exist in ./ssl directory');
  process.exit(0);
}

try {
  console.log('Generating self-signed SSL certificate...');
  
  // Generate self-signed certificate using OpenSSL
  // Valid for 365 days
  execSync(`openssl req -x509 -newkey rsa:4096 -keyout "${keyPath}" -out "${certPath}" -days 365 -nodes -subj "/C=ZA/ST=Gauteng/L=Johannesburg/O=PayNow/OU=Dev/CN=localhost"`, {
    stdio: 'inherit'
  });
  
  console.log('✓ SSL certificates generated successfully!');
  console.log(`  - Private key: ${keyPath}`);
  console.log(`  - Certificate: ${certPath}`);
  console.log('\nNote: These are self-signed certificates for development only.');
  console.log('For production, use certificates from a trusted CA.\n');
} catch (error) {
  console.error('Error generating SSL certificates:', error.message);
  console.log('\nAlternative: Using Node.js built-in certificate generation...');
  
  // Fallback: Use Node's built-in crypto if OpenSSL is not available
  const { generateKeyPairSync } = require('crypto');
  const forge = require('node-forge');
  
  try {
    // Generate a key pair
    const keys = forge.pki.rsa.generateKeyPair(2048);
    
    // Create a certificate
    const cert = forge.pki.createCertificate();
    cert.publicKey = keys.publicKey;
    cert.serialNumber = '01';
    cert.validity.notBefore = new Date();
    cert.validity.notAfter = new Date();
    cert.validity.notAfter.setFullYear(cert.validity.notBefore.getFullYear() + 1);
    
    const attrs = [{
      name: 'commonName',
      value: 'localhost'
    }, {
      name: 'countryName',
      value: 'ZA'
    }, {
      shortName: 'ST',
      value: 'Gauteng'
    }, {
      name: 'localityName',
      value: 'Johannesburg'
    }, {
      name: 'organizationName',
      value: 'PayNow Dev'
    }];
    
    cert.setSubject(attrs);
    cert.setIssuer(attrs);
    cert.sign(keys.privateKey);
    
    // Save to files
    const privateKeyPem = forge.pki.privateKeyToPem(keys.privateKey);
    const certPem = forge.pki.certificateToPem(cert);
    
    fs.writeFileSync(keyPath, privateKeyPem);
    fs.writeFileSync(certPath, certPem);
    
    console.log('✓ SSL certificates generated successfully using Node.js!');
    console.log(`  - Private key: ${keyPath}`);
    console.log(`  - Certificate: ${certPath}`);
  } catch (fallbackError) {
    console.error('Failed to generate certificates:', fallbackError.message);
    console.log('\nPlease install OpenSSL or ensure node-forge is installed.');
    process.exit(1);
  }
}

