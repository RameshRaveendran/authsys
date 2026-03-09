const nodemailer = require('nodemailer');

/**
 * Create a transporter using MailTrap
 * Configure MAILTRAP_HOST, MAILTRAP_PORT, MAILTRAP_USER, MAILTRAP_PASS in .env
 */
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.MAILTRAP_HOST,
    port: process.env.MAILTRAP_PORT,
    auth: {
      user: process.env.MAILTRAP_USER,
      pass: process.env.MAILTRAP_PASS,
    },
  });
};

/**
 * Send OTP email
 * @param {string} email - Recipient email address
 * @param {string} otp - OTP code
 * @returns {Promise} - Email sending result
 */
const sendOTPEmail = async (email, otp) => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: process.env.MAILTRAP_FROM || 'noreply@authsystem.com',
      to: email,
      subject: 'Verify Your Account',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px;">
            <h2 style="color: #333; margin-bottom: 20px;">Verify Your Account</h2>
            
            <p style="color: #666; font-size: 16px; margin-bottom: 20px;">
              Your OTP (One-Time Password) for account verification is:
            </p>
            
            <div style="background-color: #fff; border: 2px solid #007bff; border-radius: 8px; padding: 20px; text-align: center; margin-bottom: 20px;">
              <h1 style="color: #007bff; font-size: 48px; letter-spacing: 10px; margin: 0;">
                ${otp}
              </h1>
            </div>
            
            <p style="color: #666; font-size: 14px; margin-bottom: 10px;">
              <strong>Note:</strong> This OTP is valid for 5 minutes only. Do not share this code with anyone.
            </p>
            
            <p style="color: #999; font-size: 12px; margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd;">
              If you did not request this code, please ignore this email or contact our support team.
            </p>
          </div>
        </div>
      `,
      text: `Your OTP is ${otp}. This is valid for 5 minutes only.`,
    };

    const result = await transporter.sendMail(mailOptions);
    console.log(`[EMAIL] OTP sent successfully to ${email}`);
    return result;
  } catch (error) {
    console.error(`[EMAIL ERROR] Failed to send OTP to ${email}:`, error.message);
    throw error;
  }
};

/**
 * Send verification email
 * @param {string} email - Recipient email address
 * @param {string} userName - User name
 * @returns {Promise} - Email sending result
 */
const sendVerificationEmail = async (email, userName) => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: process.env.MAILTRAP_FROM || 'noreply@authsystem.com',
      to: email,
      subject: 'Account Verified Successfully',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px;">
            <h2 style="color: #333; margin-bottom: 20px;">Welcome ${userName}!</h2>
            <p style="color: #666; font-size: 16px;">
              Your account has been verified successfully. You can now log in to your account.
            </p>
          </div>
        </div>
      `,
      text: `Welcome ${userName}! Your account has been verified successfully.`,
    };

    const result = await transporter.sendMail(mailOptions);
    console.log(`[EMAIL] Verification email sent to ${email}`);
    return result;
  } catch (error) {
    console.error(`[EMAIL ERROR] Failed to send verification email to ${email}:`, error.message);
    throw error;
  }
};

module.exports = {
  sendOTPEmail,
  sendVerificationEmail,
};
