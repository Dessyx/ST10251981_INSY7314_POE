// seed-admin.js - Script to create admin user in MongoDB
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
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
  role: { type: String, enum: ['customer', 'employee', 'admin'], default: 'customer' },
  balance: { type: Number, default: 0 }
});

const User = mongoose.model('User', userSchema);

// Seed admin user
const seedAdmin = async () => {
  try {
    await connectDB();

    // Check if admin already exists
    const existingAdmin = await User.findOne({ username: 'admin' });
    if (existingAdmin) {
      console.log('⚠ Admin user already exists');
      process.exit(0);
    }

    const PEPPER = process.env.PEPPER || '';
    const adminPassword = 'Admin@123'; // Change this in production!
    const hashedPassword = await bcrypt.hash(adminPassword + PEPPER, 10);

    const adminUser = new User({
      full_name: 'System Administrator',
      id_number: '000000000',
      account_number: 'ADMIN001',
      username: 'admin',
      password_hash: hashedPassword,
      role: 'admin',
      balance: 0
    });

    await adminUser.save();
    console.log('✓ Admin user created successfully');
    console.log('  Username: admin');
    console.log('  Account Number: ADMIN001');
    console.log('  Password: Admin@123');
    console.log('  ⚠ Please change the password after first login!');

    // Create employee user
    const existingEmployee = await User.findOne({ username: 'employee' });
    if (!existingEmployee) {
      const employeePassword = 'Employee@123';
      const hashedEmployeePassword = await bcrypt.hash(employeePassword + PEPPER, 10);

      const employeeUser = new User({
        full_name: 'Employee User',
        id_number: '111111111',
        account_number: 'EMP001',
        username: 'employee',
        password_hash: hashedEmployeePassword,
        role: 'employee',
        balance: 0
      });

      await employeeUser.save();
      console.log('✓ Employee user created successfully');
      console.log('  Username: employee');
      console.log('  Account Number: EMP001');
      console.log('  Password: Employee@123');
    }

    process.exit(0);
  } catch (err) {
    console.error('Error seeding admin:', err);
    process.exit(1);
  }
};

seedAdmin();

