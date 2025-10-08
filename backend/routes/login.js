const express = require("express");
const app = express();
const router = express.Router();

const User = require('../models/user')
const { generateToken, verifyToken } = require('../utils/auth')

// Login route
// Login route
router.post('/login', async (req, res) => {
  try {
    const { employeeId, password } = req.body
    
    // Input validation
    if (!employeeId || !password) {
      return res.status(400).json({ 
        success: false,
        message: 'Employee ID and password are required' 
      })
    }
    
    const user = await User.findOne({ employeeId })
    if (!user) {
      return res.status(401).json({ 
        success: false,
        message: 'Invalid credentials' 
      })
    }

    if (user.password !== password) {
      return res.status(401).json({ 
        success: false,
        message: 'Invalid credentials' 
      })
    }

    // Generate token
    const token = generateToken(user)

    // Set cookie with cross-origin support - FIXED VERSION
    const isProduction = process.env.NODE_ENV === 'production';

   // Cookies - try without domain first
res.cookie('orgflow_token', token, {
  httpOnly: true,
  secure: true,
  sameSite: 'none',
  maxAge: 24 * 60 * 60 * 1000,
  path: '/'
});

    console.log('Cookie set with domain:', isProduction ? '.onrender.com' : 'localhost');

    res.json({ 
      success: true,
      message: 'Login successful',
      user: {
        _id: user._id,
        name: user.name,
        employeeId: user.employeeId,
        role: user.role
      }
    })

  } catch (error) {
    console.error('Login error:', error)
    res.status(500).json({ 
      success: false,
      message: 'Login failed', 
      error: error.message 
    })
  }
})


// Logout route
router.post('/logout', (req, res) => {
  // Use the same options as when setting the cookie
  res.clearCookie('orgflow_token', {
    httpOnly: true,
    secure: true,
    sameSite: 'none',
    path: '/'
    // Don't include domain unless you specifically set it when creating the cookie
  });
  
  res.json({ 
    success: true,
    message: 'Logged out successfully' 
  });
});


// User data route
router.get('/check-auth', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password')
    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: 'User not found' 
      })
    }
    res.json({ 
      success: true,
      user: {
        _id: user._id,
        name: user.name,
        employeeId: user.employeeId,
        role: user.role
      }
    })
  } catch (error) {
    console.error('Error checking auth:', error)
    res.status(500).json({ 
      success: false,
      message: 'Error checking authentication status' 
    })
  }
})

// Debug endpoint to test cookie reception
router.get('/debug-cookies', (req, res) => {
  console.log('=== COOKIE DEBUG ===');
  console.log('All cookies:', req.cookies);
  console.log('orgflow_token exists:', !!req.cookies.orgflow_token);
  console.log('Request origin:', req.headers.origin);
  console.log('Request headers:', req.headers);
  
  res.json({
    success: true,
    cookiesReceived: req.cookies,
    hasOrgflowToken: !!req.cookies.orgflow_token,
    origin: req.headers.origin
  });
})

module.exports = router