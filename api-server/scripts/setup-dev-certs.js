#!/usr/bin/env node
/**
 * setup-dev-certs.js
 *
 * Generates trusted localhost certificates using mkcert for multi-browser local development.
 * - Detects mkcert presence; instructs install if missing.
 * - Runs `mkcert -install` (safe to re-run) to ensure trust store integration across Chrome, Edge, Firefox, etc.
 * - Generates a cert with SANs: localhost, 127.0.0.1, ::1
 * - Places/updates cert.pem & key.pem in ../ssl
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const sslDir = path.join(__dirname, '..', 'ssl');
if (!fs.existsSync(sslDir)) {
  fs.mkdirSync(sslDir, { recursive: true });
}

const targetCert = path.join(sslDir, 'cert.pem');
const targetKey = path.join(sslDir, 'key.pem');

function hasMkcert() {
  try {
    execSync(process.platform === 'win32' ? 'where mkcert' : 'which mkcert', { stdio: 'ignore' });
    return true;
  } catch {
    return false;
  }
}

function log(msg) { console.log(msg); }
function warn(msg) { console.warn('\u26A0\uFE0F ' + msg); }
function error(msg) { console.error('\u274C ' + msg); }

log('\n=== Dev HTTPS Certificate Setup ===');

if (!hasMkcert()) {
  error('mkcert is not installed.');
  warn('Install instructions:');
  if (process.platform === 'win32') {
    console.log('  - With Chocolatey: choco install mkcert nss-tools');
  } else if (process.platform === 'darwin') {
    console.log('  - With Homebrew: brew install mkcert nss');
  } else {
    console.log('  - On Linux:');
    console.log('      1. Install dependencies (e.g. sudo apt install libnss3-tools)');
    console.log('      2. Download binary from https://github.com/FiloSottile/mkcert/releases');
    console.log('      3. Place it in /usr/local/bin and chmod +x');
  }
  process.exit(1);
}

try {
  log('\nEnsuring local root CA is installed/trusted (safe to re-run)...');
  execSync('mkcert -install', { stdio: 'inherit' });

  log('\nGenerating (or regenerating) localhost certificate...');
  // Generate into sslDir
  execSync('mkcert -cert-file "temp-cert.pem" -key-file "temp-key.pem" localhost 127.0.0.1 ::1', { cwd: sslDir, stdio: 'inherit' });

  // Replace existing certs automically
  const tempCert = path.join(sslDir, 'temp-cert.pem');
  const tempKey = path.join(sslDir, 'temp-key.pem');
  fs.copyFileSync(tempCert, targetCert);
  fs.copyFileSync(tempKey, targetKey);
  fs.unlinkSync(tempCert);
  fs.unlinkSync(tempKey);

  log('\n\u2705 Trusted development certificates ready.');
  log('   Certificate: ' + targetCert);
  log('   Key:         ' + targetKey);
  log('\nNext steps:');
  log('  1. Start API server: npm start (or npm run dev) in api-server');
  log('  2. Start React app after regenerating its .env if needed (customer-portal)');
  log('  3. Visit https://localhost:4000/health and https://localhost:3000');
  log('  4. You should now see a secure padlock (no warning).');
} catch (e) {
  error('Failed to generate trusted certificates.');
  warn('Details: ' + e.message);
  process.exit(1);
}
