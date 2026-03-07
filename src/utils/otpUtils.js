const crypto = require('crypto');

/**
 * Generate a random 6-digit OTP
 * @returns {string} - 6-digit OTP code
 */
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

/**
 * Generate expiration time (10 minutes from now)
 * @returns {Date} - Expiration date
 */
const getOTPExpiration = () => {
  return new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
};

/**
 * Verify OTP validity
 * @param {Date} expiresAt - OTP expiration time
 * @returns {boolean} - True if OTP is still valid
 */
const isOTPValid = (expiresAt) => {
  return new Date() < new Date(expiresAt);
};

module.exports = {
  generateOTP,
  getOTPExpiration,
  isOTPValid,
};
