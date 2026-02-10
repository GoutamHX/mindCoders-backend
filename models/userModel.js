import mongoose from 'mongoose';
import { hashPassword, comparePassword, getResetPasswordToken } from '../utils/userHelpers.js';

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date
});

// Hash password before saving 
userSchema.pre('save', hashPassword);
// Compare password
userSchema.methods.comparePassword = comparePassword;
// Generate password reset token
userSchema.methods.getResetPasswordToken = getResetPasswordToken;
const Member = mongoose.model('Member', userSchema);

export default Member;
