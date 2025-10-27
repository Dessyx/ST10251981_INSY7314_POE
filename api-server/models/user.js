const mongoose = require('../database');
const { encrypt, decrypt } = require('../utils/encryption');

const userSchema = new mongoose.Schema({
  full_name: { type: String, required: true },
  id_number: { type: String, required: true, unique: true },
  account_number: { type: String, required: true, unique: true },
  username: { type: String, required: true, unique: true },
  password_hash: { type: String, required: true },
  role: { type: String, enum: ['customer', 'admin'], default: 'customer' },
  balance: { type: Number, default: 0 }
});

const User = mongoose.model('User', userSchema);

// Custom functions
async function getUserByEmail(email) {
  return await User.findOne({ email });
}

async function getUserByUsername(username) {
  return await User.findOne({ username });
}

async function getUserByAccountNumber(account_number) {
  return await User.findOne({ account_number });
}
async function getUserByIdNumber(id_number) {
  return await User.findOne({ id_number });
}

async function createUser(data) {
  const bcrypt = require('bcrypt');
  const PEPPER = process.env.PEPPER || '';
  const hashedPassword = await bcrypt.hash(data.password + PEPPER, 10);

  // encrypt sensitive fields
  const encryptedIdNumber = data.id_number ? encrypt(data.id_number) : null;
  const encryptedAccountNumber = data.account_number ? encrypt(data.account_number) : null;

  const newUser = new User({
    full_name: data.full_name,
    id_number: encryptedIdNumber,
    account_number: encryptedAccountNumber,
    username: data.username,
    password_hash: hashedPassword,
    balance: 0
  });

  const savedUser = await newUser.save();
  return savedUser._id;
}

// helper to get user and decrypt sensitive fields
async function findUserByUsernameDecrypted(username) {
  const user = await User.findOne({ username });
  if (!user) return null;
  const obj = user.toObject();

  // decrypt fields if present
  try {
    obj.id_number = obj.id_number ? decrypt(obj.id_number) : null;
    obj.account_number = obj.account_number ? decrypt(obj.account_number) : null;
  } catch (err) {
    console.warn('Failed to decrypt fields for user:', user._id, err);
  }

  return obj;
}

module.exports = {
  User,
  getUserByUsername,           
  getUserByAccountNumber,
  getUserByIdNumber,
  createUser,
  findUserByUsernameDecrypted  
};