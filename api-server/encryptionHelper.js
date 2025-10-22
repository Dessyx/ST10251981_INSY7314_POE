const fs = require('fs');
const { MongoClient, ClientEncryption, Binary } = require('mongodb');
require('dotenv').config();

// Decode the local master key from base64
const localMasterKey = Buffer.from(fs.readFileSync('./master-key.txt', 'utf8'), 'base64');


const uri = process.env.MONGO_URI;

if (!uri) {
  console.error(' MONGO_URI is missing in your .env file!');
  process.exit(1);
}

// Key Vault namespace
const keyVaultNamespace = 'encryption.__keyVault';

let encryption;

// Initialize ClientEncryption with a connected MongoClient
async function initEncryption(client) {
  if (encryption) return encryption;

  // Ensure the client is connected
  await client.connect();

  encryption = new ClientEncryption(client, {
    keyVaultNamespace,
    kmsProviders: {
      local: { key: localMasterKey }
    }
  });

  return encryption;
}

// Encrypt a value using a DEK (base64 string)
async function encryptField(client, dekIdBase64, value) {
  const enc = await initEncryption(client);
  const dekIdBinary = new Binary(Buffer.from(dekIdBase64, 'base64'), 4); // Use subtype 4
  return await enc.encrypt(value, {
    keyId: dekIdBinary,
    algorithm: 'AEAD_AES_256_CBC_HMAC_SHA_512-Deterministic'
  });
}

// Decrypt a value
async function decryptField(client, encryptedValue) {
  const enc = await initEncryption(client);
  return await enc.decrypt(encryptedValue);
}

module.exports = {
  initEncryption,
  encryptField,
  decryptField,
  keyVaultNamespace
};
