const { MongoClient, Binary } = require('mongodb');
const { encryptField, decryptField } = require('./encryptionHelper');
const fs = require('fs');
require('dotenv').config();

const uri = process.env.MONGO_URI;

async function runTest() {
  const client = new MongoClient(uri);
  const dekId = fs.readFileSync('./dek-id.txt', 'utf8');

  try {
    await client.connect();
    const db = client.db('paynow');
    const users = db.collection('users');

    //  Encrypt sensitive fields
    const encryptedEmail = await encryptField(client, dekId, 'soyama@example.com');
    const encryptedSSN   = await encryptField(client, dekId, '123-45-6789');

    //  Insert test user
    const result = await users.insertOne({
      name: 'Soyama Pango',
      email: encryptedEmail,
      ssn: encryptedSSN,
    });

    console.log('Test user inserted with encrypted fields:', result.insertedId);

    //  Fetch the user
    const user = await users.findOne({ _id: result.insertedId });
    console.log(' Encrypted in DB:', user);

    //  Decrypt fields
    const decryptedEmail = await decryptField(client, user.email);
    const decryptedSSN   = await decryptField(client, user.ssn);

    console.log(' Decrypted fields:');
    console.log('Email:', decryptedEmail.toString());
    console.log('SSN:', decryptedSSN.toString());
  } catch (err) {
    console.error('Error during test:', err);
  } finally {
    await client.close();
  }
}

runTest();
