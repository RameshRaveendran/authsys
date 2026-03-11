/**
 * Pages controller - Render EJS pages
 */

// GET / - Home page
const home = (req, res) => {
  res.render('index', { title: 'Auth System' });
};

// GET /register - Register page
const registerPage = (req, res) => {
  res.render('register', { title: 'Register' });
};

// GET /login - Login page
const loginPage = (req, res) => {
  res.render('login', { title: 'Login' });
};

// GET /verify - Verify OTP page
const verifyPage = (req, res) => {
  res.render('verify', { title: 'Verify Email' });
};

// GET /dashboard - Dashboard (protected)
const dashboard = (req, res) => {
  res.render('dashboard', { 
    title: 'Dashboard',
    user: req.user 
  });
};

// GET /profile - Profile page (protected)
const profile = (req, res) => {
  res.render('profile', { 
    title: 'Profile',
    user: req.user 
  });
};

// GET /forgot-password - Forgot password page
const forgotPasswordPage = (req, res) => {
  res.render('forgot-password', { title: 'Forgot Password' });
};

// GET /reset-password - Reset password page
const resetPasswordPage = (req, res) => {
  res.render('reset-password', { title: 'Reset Password' });
};

module.exports = {
  home,
  registerPage,
  loginPage,
  verifyPage,
  dashboard,
  profile,
  forgotPasswordPage,
  resetPasswordPage,
};
