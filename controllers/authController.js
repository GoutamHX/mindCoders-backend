import Member from '../models/userModel.js';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { sendEmail, emailTemplates } from '../utils/sendMail.js';
const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';

// Register new user
export const register = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const existingUser = await Member.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const member = new Member({ email, password });
    await member.save();

    const token = jwt.sign(
      { userId: member._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: { id: member._id, email: member.email }
    });
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong', error: error.message });
  }
};


// Login user
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await Member.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Incorrect password' });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: '7d'
    });

    res.status(200).json({
      message: 'Login successful',
      token,
      Member: { id: user._id, email: user.email }
    });
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong', error: error.message });
  }
};

// Forgot Password
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await Member.findOne({ email }).select(
      'email resetPasswordToken resetPasswordExpire'
    );

    if (!user) {
      return res.status(404).json({
        message: 'There is no registered user with the specified email address.'
      });
    }
    const resetToken = user.getResetPasswordToken();
    // Save token (only required fields)
    await user.save({ validateBeforeSave: false });
    const resetUrl = `${frontendUrl}/reset-password/${resetToken}`;
    
    const template = emailTemplates.resetPassword(resetUrl);
    
    try {
      await sendEmail({
        email: user.email,
        subject: template.subject,
        html: template.html
      });
      
      console.log('Password reset email sent successfully to:', user.email);
      res.status(200).json({ message: 'Email sent successfully' });
      
    } catch (emailError) {
      console.error('Failed to send email:', emailError);
      console.error('Email error details:', {
        code: emailError.code,
        command: emailError.command,
        response: emailError.response,
        responseCode: emailError.responseCode
      });
      
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      await user.save({ validateBeforeSave: false });
      
      return res.status(500).json({
        message: 'Failed to send email. Please try again later.',
        error: emailError.message
      });
    }

  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({
      message: 'Something went wrong',
      error: error.message
    });
  }
};

// Reset Password
export const resetPassword = async (req, res) => {
  try {
    const resetPasswordToken = crypto
      .createHash('sha256')
      .update(req.params.token)
      .digest('hex');

    const user = await Member.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired token' });
    }

    // Set new password
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    res.status(200).json({ message: 'Password updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong', error: error.message });
  }
};
