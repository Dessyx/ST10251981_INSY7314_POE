
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { encrypt } = require('./utils/encryption');
require('dotenv').config();

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✓ Connected to MongoDB');
  } catch (err) {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  }
};

// Define User Schema
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

// Reset admin user
const resetAdmin = async () => {
  try {
    await connectDB();

    // Delete existing admin user
    const deleteResult = await User.deleteOne({ username: 'admin' });
    if (deleteResult.deletedCount > 0) {
      console.log('✓ Old admin user deleted');
    } else {
      console.log('ℹ No existing admin user found');
    }

    const PEPPER = process.env.PEPPER || '';
    const adminPassword = 'Admin@123!'; 
    const hashedPassword = await bcrypt.hash(adminPassword + PEPPER, 10);

    const encryptedIdNumber = encrypt('000000000');
    const encryptedAccountNumber = encrypt('999999999999');

    const adminUser = new User({
      full_name: 'System Administrator',
      id_number: encryptedIdNumber,
      account_number: encryptedAccountNumber,
      username: 'admin',
      password_hash: hashedPassword,
      role: 'admin',
      balance: 0
    });

    await adminUser.save();
    console.log('');
    console.log('✓ Admin user created successfully!');
    console.log('');
    console.log('Login credentials:');
    console.log('  Username: admin');
    console.log('  Account Number: 999999999999');
    console.log('  Password: Admin@123!');
    console.log('');
    console.log('IMPORTANT: Change the password after first login!');
    console.log('');

    process.exit(0);
  } catch (err) {
    console.error('Error resetting admin:', err);
    process.exit(1);
  }
};

resetAdmin();

