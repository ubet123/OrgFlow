const express = require('express')
const router = express.Router()
const User = require('../models/user')
const { generateToken, verifyToken } = require('../utils/auth')

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

    // Set cookie with cross-origin support
    res.cookie('orgflow_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // true in production, false in development
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax', // 'none' for cross-origin
      maxAge: 24 * 60 * 60 * 1000, // 1 day
      path: '/', // Important for cookie to be accessible across all routes
    })

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
  res.clearCookie('orgflow_token', {
    path: '/', // Must match the path used when setting the cookie
  })
  res.json({ 
    success: true,
    message: 'Logged out successfully' 
  })
})

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

module.exports = router