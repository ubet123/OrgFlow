const express = require('express');
const router = express.Router();
const User = require('../models/user')


router.post('/login', async (req, res) => {
  try {
    const { employeeId, password } = req.body;
    
   
    const user = await User.findOne({ employeeId });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

  
    if (user.password !== password) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Return user data (excluding password)
    const userData = {
      _id: user._id,
      name: user.name,
      employeeId: user.employeeId,
      role: user.role
    };

    res.json({ 
      message: 'Login successful',
      user: userData
    });

  } catch (error) {
    res.status(500).json({ message: 'Login failed', error: error.message });
  }
});

module.exports = router;