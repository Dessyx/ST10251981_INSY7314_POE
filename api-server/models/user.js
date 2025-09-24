import mongoose from 'mongoose';

const hist = new mongoose.Schema({
  hash: { type: String, required: true },
  changedAt: { type: Date, default: Date.now }
}, { _id: false });


const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true, trim: true },
  saIdNumber: { type: String, required: true, index: true },
  accountNumber: { type: String, required: true, index: true },
  email: { type: String, required: true, lowercase: true, unique: true },
  passwordHash: { type: String, required: true },
  passwordHistory: { type: [hist], default: [] }
}, { timestamps: true });

export default mongoose.model('User', userSchema);
