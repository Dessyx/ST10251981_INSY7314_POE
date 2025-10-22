// createDek.js
const fs = require('fs');
const { MongoClient, ClientEncryption } = require('mongodb');
require('dotenv').config(); // Load MONGO_URI from .env

// Read the local master key and decode Base64
const localMasterKey = Buffer.from(fs.readFileSync('./master-key.txt', 'utf8'), 'base64');

// MongoDB connection string from .env
const uri = process.env.MONGO_URI;

if (!uri) {
  console.error('MONGO_URI is missing in your .env file!');
  process.exit(1);
}

async function createDek() {
  const client = new MongoClient(uri);

  try {
    await client.connect();

    // Create the ClientEncryption object
    const encryption = new ClientEncryption(client, {
      keyVaultNamespace: 'encryption.__keyVault',
      kmsProviders: {
        local: {
          key: localMasterKey
        }
      }
    });

    // Create a new Data Encryption Key (DEK)
    const dekId = await encryption.createDataKey('local');

    console.log(' DEK created successfully!');
    console.log('DEK ID (base64):', dekId.toString('base64'));

    // Save the DEK ID to a file
    fs.writeFileSync('./dek-id.txt', dekId.toString('base64'));
    console.log(' dek-id.txt saved');
  } catch (err) {
    console.error('Error creating DEK:', err);
  } finally {
    await client.close();
  }
}

createDek();
