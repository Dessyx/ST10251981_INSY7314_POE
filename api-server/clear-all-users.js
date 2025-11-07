
const mongoose = require('mongoose');
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

// Clear all users
const clearAllUsers = async () => {
  try {
    await connectDB();
    
    // Delete all users
    const result = await User.deleteMany({});
    console.log(`✓ Deleted ${result.deletedCount} user(s) from database`);
    console.log('');
    console.log('Database cleared successfully!');
    console.log('');
    console.log('Next step: Run "npm run reset-admin" to create a fresh admin user');
    console.log('');

    process.exit(0);
  } catch (err) {
    console.error('Error clearing users:', err);
    process.exit(1);
  }
};

clearAllUsers();

// test