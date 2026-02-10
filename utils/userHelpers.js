import bcrypt from 'bcryptjs';
import crypto from 'crypto';

// Hash password before saving
export const hashPassword = async function () {
  if (!this.isModified('password')) return;
  this.password = await bcrypt.hash(this.password, 10);
};

// Compare password
export const comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

// Generate password reset token
export const getResetPasswordToken = function () {
  // Generate token
  const resetToken = crypto.randomBytes(20).toString('hex');

  // Hash and set to resetPasswordToken
  this.resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

// Set token expire time (3 minutes)
this.resetPasswordExpire = Date.now() + 3 * 60 * 1000;


  return resetToken;
};
