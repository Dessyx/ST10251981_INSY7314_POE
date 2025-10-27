// api-server/utils/encryption.js
const crypto = require('crypto');

const ALGO = 'aes-256-gcm';
const IV_LENGTH = 12;           
const AUTH_TAG_LENGTH = 16;      

// Read key from env (base64 or raw string). Expect 32 bytes (256 bits).
const RAW_KEY = process.env.DB_ENCRYPTION_KEY || '12345678901234567890123456789012';

function getKeyBuffer() {
  // Accept either a base64-encoded key or a 32-char raw string
  let keyBuf;
  try {
    // If it looks like base64 (has '+' or '/' or ends with '='), decode base64
    if (/^[A-Za-z0-9+/=]+$/.test(RAW_KEY) && RAW_KEY.length !== 32) {
      keyBuf = Buffer.from(RAW_KEY, 'base64');
    } else {
      keyBuf = Buffer.from(RAW_KEY);
    }
  } catch (e) {
    throw new Error('Failed to decode DB_ENCRYPTION_KEY. Provide 32-byte key (raw) or base64.');
  }

  if (keyBuf.length !== 32) {
    throw new Error(`DB_ENCRYPTION_KEY must be 32 bytes (256 bits). Current length: ${keyBuf.length}`);
  }
  return keyBuf;
}

const KEY = getKeyBuffer();

/**
 * Encrypt a UTF-8 string. Returns base64 string containing iv:tag:ciphertext
 * Format: base64( iv || authTag || ciphertext )
 */
function encrypt(plainText) {
  if (plainText === undefined || plainText === null) return null;
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGO, KEY, iv, { authTagLength: AUTH_TAG_LENGTH });
  const encrypted = Buffer.concat([cipher.update(String(plainText), 'utf8'), cipher.final()]);
  const authTag = cipher.getAuthTag();

  // bundle iv + tag + ciphertext as a single Buffer
  const out = Buffer.concat([iv, authTag, encrypted]);
  return out.toString('base64');
}

/**
 * Decrypt the value produced by encrypt()
 * Accepts the base64 string and returns UTF-8 plaintext
 */
function decrypt(b64) {
  if (!b64) return null;
  const data = Buffer.from(b64, 'base64');
  if (data.length < IV_LENGTH + AUTH_TAG_LENGTH + 1) {
    throw new Error('Encrypted data is malformed or too short');
  }

  const iv = data.slice(0, IV_LENGTH);
  const authTag = data.slice(IV_LENGTH, IV_LENGTH + AUTH_TAG_LENGTH);
  const ciphertext = data.slice(IV_LENGTH + AUTH_TAG_LENGTH);

  const decipher = crypto.createDecipheriv(ALGO, KEY, iv, { authTagLength: AUTH_TAG_LENGTH });
  decipher.setAuthTag(authTag);
  const decrypted = Buffer.concat([decipher.update(ciphertext), decipher.final()]);
  return decrypted.toString('utf8');
}

module.exports = {
  encrypt,
  decrypt
};
