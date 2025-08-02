const jwt = require('jsonwebtoken')
require('dotenv').config()
const User=require('../models/user')

// Create token
const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, employeeId: user.employeeId, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '1d' }
  )
}

// Verify token middleware
const verifyToken = async (req, res, next) => {
  
  const token = req.cookies.token;
  
  if (!token) {
    return res.status(401).json({ 
      success: false,
      message: 'Authorization token missing' 
    });
  }

  try {
   
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    if (!decoded?.id) {
      return res.status(401).json({ 
        success: false,
        message: 'Invalid token payload' 
      });
    }

    
    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      // Clear invalid token
      res.clearCookie('token');
      return res.status(401).json({ 
        success: false,
        message: 'User account not found' 
      });
    }

  
    req.user = {
      id: user._id,
      name: user.name,
      role: user.role,
      employeeId: user.employeeId,
     
    };
    next();
  } catch (error) {
    
    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({ 
        success: false,
        message: 'Token expired' 
      });
    }
    
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({ 
        success: false,
        message: 'Invalid token' 
      });
    }

 
    console.error('Token verification error:', error);
    return res.status(500).json({ 
      success: false,
      message: 'Internal server error during authentication' 
    });
  }
};

module.exports = { generateToken, verifyToken }