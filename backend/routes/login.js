const express = require("express");
const router = express.Router();
const { verifyToken } = require('../utils/auth');
const {
  login,
  logout,
  checkAuth,
  debugCookies
} = require('../controllers/authController');

// Login route
router.post('/login', login);

// Logout route
router.post('/logout', logout);

// User data route
router.get('/check-auth', verifyToken, checkAuth);

// Debug endpoint to test cookie reception
router.get('/debug-cookies', debugCookies);

module.exports = router;