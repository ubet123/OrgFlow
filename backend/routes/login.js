const express = require('express')
const router = express.Router()
const User = require('../models/user')
const { generateToken,verifyToken } = require('../utils/auth')


//Login route
router.post('/login', async (req, res) => {
  try {
    const { employeeId, password } = req.body
    
    const user = await User.findOne({ employeeId })
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' })
    }

    if (user.password !== password) {
      return res.status(401).json({ message: 'Invalid credentials' })
    }

    // Generate token
    const token = generateToken(user)

    // Set cookie
    res.cookie('orgflow_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 * 1000 // 1 day
    })

    res.json({ 
      message: 'Login successful',
      user: {
        _id: user._id,
        name: user.name,
        employeeId: user.employeeId,
        role: user.role
      }
    })

  } catch (error) {
    res.status(500).json({ message: 'Login failed', error: error.message })
  }
})

//logout route
router.post('/logout', (req, res) => {
  res.clearCookie('orgflow_token')
  res.json({ message: 'Logged out successfully' })
})

//user data route
router.get('/check-auth', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ user });
  } catch (error) {
    console.error('Error checking auth:', error);
    res.status(500).json({ message: 'Error checking authentication status' });
  }
});






module.exports = router