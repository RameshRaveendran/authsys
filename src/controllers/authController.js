const User = require('../models/User');
const OTP = require('../models/OTP');
const { hashPassword, comparePassword } = require('../utils/passwordUtils');
const { generateOTP, getOTPExpiration, isOTPValid } = require('../utils/otpUtils');
const { sendOTPEmail, sendVerificationEmail } = require('../utils/emailUtils');

/**
 * Register a new user
 * POST /api/auth/register
 * Flow:
 * 1. Validate input
 * 2. Hash password
 * 3. Create user
 * 4. Generate OTP
 * 5. Store OTP
 */
const register = async (req, res) => {
  try {
    const { name, email, phone, password, confirmPassword } = req.body;
    console.log(req.body)

    // STEP 1: Validate input
    if (!name || !email || !phone || !password || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields',
      });
    }

    // Validate name length
    if (name.length < 2) {
      return res.status(400).json({
        success: false,
        message: 'Name must be at least 2 characters',
      });
    }

    // Validate email format
    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email',
      });
    }

    // Validate phone
    if (!/^[0-9]{10}$/.test(phone)) {
      return res.status(400).json({
        success: false,
        message: 'Phone must be 10 digits',
      });
    }

    // Validate password match
    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'Passwords do not match',
      });
    }

    // Validate password strength
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters',
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Email already registered',
      });
    }

    // STEP 2: Hash password
    const passwordHash = await hashPassword(password);

    // STEP 3: Create new user
    const user = await User.create({
      name,
      email,
      phone,
      passwordHash,
      isVerified: false,
    });

    // STEP 4: Generate OTP
    const otp = generateOTP();
    const expiresAt = getOTPExpiration();

    // STEP 5: Store OTP in database
    await OTP.findOneAndUpdate(
      { email },
      { otp, expiresAt, verified: false },
      { upsert: true, new: true }
    );

    // STEP 6: Send OTP to email
    try {
      await sendOTPEmail(email, otp);
    } catch (emailError) {
      console.error('Email sending failed:', emailError.message);
      // Continue registration even if email fails
    }

    return res.status(201).json({
      success: true,
      message: 'User registered successfully. OTP sent to email',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        isVerified: user.isVerified,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
/**
 * Verify OTP
 * POST /api/auth/verify-otp
 */
const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    // Validation
    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and OTP',
      });
    }

    // Find OTP record
    const otpRecord = await OTP.findOne({ email });
    if (!otpRecord) {
      return res.status(400).json({
        success: false,
        message: 'OTP not found or expired',
      });
    }

    // Check if OTP is expired
    if (!isOTPValid(otpRecord.expiresAt)) {
      await OTP.deleteOne({ email });
      return res.status(400).json({
        success: false,
        message: 'OTP has expired',
      });
    }

    // Verify OTP code
    if (otpRecord.otp !== otp) {
      otpRecord.attempts += 1;
      if (otpRecord.attempts >= 3) {
        await OTP.deleteOne({ email });
        return res.status(400).json({
          success: false,
          message: 'Too many failed attempts. Please register again',
        });
      }
      await otpRecord.save();
      return res.status(400).json({
        success: false,
        message: `Invalid OTP. ${3 - otpRecord.attempts} attempts remaining`,
      });
    }

    // Mark user as verified
    const user = await User.findOneAndUpdate(
      { email },
      { isVerified: true },
      { new: true }
    );

    // Delete OTP record
    await OTP.deleteOne({ email });

    // Send verification email
    try {
      await sendVerificationEmail(email, user.name);
    } catch (emailError) {
      console.error('Verification email failed:', emailError.message);
      // Continue even if email fails
    }

    return res.status(200).json({
      success: true,
      message: 'Email verified successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        isVerified: user.isVerified,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Resend OTP
 * POST /api/auth/resend-otp
 */
const resendOTP = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email',
      });
    }

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'User not found',
      });
    }

    if (user.isVerified) {
      return res.status(400).json({
        success: false,
        message: 'Email already verified',
      });
    }

    // Generate and store new OTP
    const otp = generateOTP();
    const expiresAt = getOTPExpiration();

    await OTP.findOneAndUpdate(
      { email },
      { otp, expiresAt, attempts: 0, verified: false },
      { upsert: true, new: true }
    );

    // Send OTP to email
    try {
      await sendOTPEmail(email, otp);
    } catch (emailError) {
      console.error('Email sending failed:', emailError.message);
      // Continue resending even if email fails
    }

    return res.status(200).json({
      success: true,
      message: 'OTP resent successfully',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Login user
 * POST /api/auth/login
 */
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password',
      });
    }

    // Find user
    const user = await User.findOne({ email }).select('+passwordHash');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    // Compare passwords
    const isPasswordValid = await comparePassword(password, user.passwordHash);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Login successful',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  register,
  verifyOTP,
  resendOTP,
  login,
};
