const mongoose = require('../database');

const userSchema = new mongoose.Schema({
  full_name: { type: String, required: true },
  id_number: { type: String, required: true, unique: true },
  account_number: { type: String, required: true, unique: true },
  username: { type: String, required: true, unique: true },
  password_hash: { type: String, required: true },
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

  const newUser = new User({
    full_name: data.full_name,
    id_number: data.id_number,
    account_number: data.account_number,
    username: data.username,
    password_hash: hashedPassword,
    balance: 0
  });

  const savedUser = await newUser.save();
  return savedUser._id;
}

module.exports = {
  User,
  getUserByUsername,
  getUserByAccountNumber,
  getUserByIdNumber,
  createUser
};