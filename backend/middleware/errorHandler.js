const errorHandler = (err, req, res, next) => {
  console.error('=== GLOBAL ERROR ===');
  console.error('Error:', err.message);
  console.error('Stack:', err.stack);
  
  // CORS errors
  if (err.message === 'Not allowed by CORS') {
    return res.status(403).json({ message: err.message });
  }
  
  // Multer file size errors
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({ 
      success: false,
      message: 'File too large. Maximum size is 10MB per file.'
    });
  }
  
  // Multer file count errors
  if (err.code === 'LIMIT_FILE_COUNT') {
    return res.status(400).json({ 
      success: false,
      message: 'Too many files. Maximum 5 files per upload.'
    });
  }
  
  // Invalid file type errors
  if (err.message && err.message.includes('Invalid file type')) {
    return res.status(400).json({ 
      success: false,
      message: err.message
    });
  }
  
  // Default error
  res.status(500).json({ 
    success: false,
    message: 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
};

module.exports = errorHandler;