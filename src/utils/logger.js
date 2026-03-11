const fs = require('fs');
const path = require('path');

// Create logs directory if it doesn't exist
const logsDir = path.join(__dirname, '../../logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

/**
 * Log types
 */
const LogType = {
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  LOGIN_FAILURE: 'LOGIN_FAILURE',
  LOGOUT: 'LOGOUT',
  PASSWORD_RESET_REQUEST: 'PASSWORD_RESET_REQUEST',
  PASSWORD_RESET_SUCCESS: 'PASSWORD_RESET_SUCCESS',
  PASSWORD_RESET_FAILURE: 'PASSWORD_RESET_FAILURE',
  REGISTRATION: 'REGISTRATION',
  EMAIL_VERIFICATION: 'EMAIL_VERIFICATION',
  EMAIL_VERIFICATION_FAILURE: 'EMAIL_VERIFICATION_FAILURE',
  SUSPICIOUS_ACTIVITY: 'SUSPICIOUS_ACTIVITY',
  UNAUTHORIZED_ACCESS: 'UNAUTHORIZED_ACCESS',
  ERROR: 'ERROR',
};

/**
 * Log event to file
 */
const logEvent = (eventType, email, message, details = {}) => {
  const timestamp = new Date().toISOString();
  const logEntry = {
    timestamp,
    eventType,
    email,
    message,
    ...details,
  };

  const logData = `[${timestamp}] ${eventType} - ${email} - ${message}\n`;
  const logPath = path.join(logsDir, 'auth-events.log');

  fs.appendFileSync(logPath, logData);

  // Also log to console in development
  if (process.env.NODE_ENV === 'development') {
    const colors = {
      LOGIN_SUCCESS: '\x1b[32m', // Green
      LOGIN_FAILURE: '\x1b[31m', // Red
      LOGOUT: '\x1b[33m', // Yellow
      PASSWORD_RESET_SUCCESS: '\x1b[32m', // Green
      PASSWORD_RESET_FAILURE: '\x1b[31m', // Red
      SUSPICIOUS_ACTIVITY: '\x1b[35m', // Magenta
      ERROR: '\x1b[31m', // Red
    };
    const color = colors[eventType] || '\x1b[37m'; // Default white
    console.log(
      `${color}[${eventType}]\x1b[0m ${email} - ${message}`
    );
  }
};

/**
 * Log error with stack trace
 */
const logError = (email, message, error) => {
  const timestamp = new Date().toISOString();
  const errorPath = path.join(logsDir, 'errors.log');
  const errorData = `[${timestamp}] ${email} - ${message}\n${error.stack}\n---\n`;

  fs.appendFileSync(errorPath, errorData);

  if (process.env.NODE_ENV === 'development') {
    console.error(`\x1b[31m[ERROR]\x1b[0m ${email} - ${message}`, error);
  }
};

/**
 * Middleware to log requests
 */
const requestLogger = (req, res, next) => {
  const originalJson = res.json;

  res.json = function (data) {
    // Log auth-related routes
    if (req.path.includes('/auth/')) {
      const email = req.body?.email || req.user?.email || 'unknown';
      
      if (req.path === '/login') {
        if (res.statusCode === 200) {
          logEvent(LogType.LOGIN_SUCCESS, email, 'Successful login');
        } else {
          logEvent(LogType.LOGIN_FAILURE, email, `Login failed: ${data.message}`);
        }
      } else if (req.path === '/logout') {
        logEvent(LogType.LOGOUT, email, 'User logged out');
      } else if (req.path === '/forgot-password') {
        logEvent(
          LogType.PASSWORD_RESET_REQUEST,
          email,
          'Password reset requested'
        );
      } else if (req.path === '/reset-password') {
        if (res.statusCode === 200) {
          logEvent(LogType.PASSWORD_RESET_SUCCESS, email, 'Password reset successful');
        } else {
          logEvent(LogType.PASSWORD_RESET_FAILURE, email, `Password reset failed: ${data.message}`);
        }
      } else if (req.path === '/register') {
        if (res.statusCode === 201) {
          logEvent(LogType.REGISTRATION, email, 'New user registered');
        }
      } else if (req.path === '/verify-otp') {
        if (res.statusCode === 200) {
          logEvent(LogType.EMAIL_VERIFICATION, email, 'Email verified successfully');
        } else {
          logEvent(
            LogType.EMAIL_VERIFICATION_FAILURE,
            email,
            `Email verification failed: ${data.message}`
          );
        }
      }
    }

    // Log unauthorized access attempts
    if (res.statusCode === 401 && req.path.includes('/protected')) {
      const email = req.user?.email || req.headers['x-forwarded-for'] || 'unknown';
      logEvent(LogType.UNAUTHORIZED_ACCESS, email, 'Unauthorized access attempt', {
        path: req.path,
        method: req.method,
      });
    }

    // Log rate limit exceeded
    if (res.statusCode === 429) {
      const email = req.body?.email || 'unknown';
      logEvent(
        LogType.SUSPICIOUS_ACTIVITY,
        email,
        'Rate limit exceeded - possible brute force attack',
        {
          ip: req.ip,
          path: req.path,
        }
      );
    }

    return originalJson.call(this, data);
  };

  next();
};

module.exports = {
  LogType,
  logEvent,
  logError,
  requestLogger,
};
