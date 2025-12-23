const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const loginroute = require('./routes/login');
const taskroute = require('./routes/task');
const userroute = require('./routes/user');
const testRoute = require('./routes/test');
const attachmentRoute = require('./routes/attachment');

const port = process.env.PORT || 3001;

// Database connection
mongoose.connect(process.env.MONGO_CONNECTION, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log('MongoDB connected'))
  .catch(error => console.error(`MongoDB connection failed: ${error}`));

const allowedOrigins = [
  'http://localhost:5173',
  'https://org-flow-six.vercel.app',
  'https://orgflow-backend.onrender.com'
];

// CORS Middleware - must come first
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, postman, etc)
    if (!origin) return callback(null, true);
    
    // Allow all in development
    if (process.env.NODE_ENV !== 'production') {
      return callback(null, true);
    }
    
    // In production, check against allowed origins
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      console.log('CORS blocked for origin:', origin);
      return callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true, // This is crucial for cookies
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Cookie', 'X-CSRF-Token']
}));

// Cookie Parser
app.use(cookieParser());

// IMPORTANT: Don't use express.json() or express.urlencoded() globally when using multer
// Multer will handle multipart/form-data, and we need to handle other content types separately

// Parse JSON bodies for non-file routes
app.use((req, res, next) => {
  if (req.headers['content-type'] && 
      req.headers['content-type'].startsWith('application/json')) {
    express.json({ limit: '50mb' })(req, res, next);
  } else if (req.headers['content-type'] && 
             req.headers['content-type'].startsWith('application/x-www-form-urlencoded')) {
    express.urlencoded({ extended: true, limit: '50mb' })(req, res, next);
  } else {
    next();
  }
});

// Test endpoint to check middleware
app.use('/test-middleware', (req, res) => {
  console.log('=== MIDDLEWARE TEST ===');
  console.log('Content-Type:', req.headers['content-type']);
  console.log('Body:', req.body);
  console.log('Files:', req.files);
  res.json({
    contentType: req.headers['content-type'],
    body: req.body,
    hasFiles: !!req.files
  });
});

// Routes
app.use('/auth', loginroute);
app.use('/task', taskroute);
app.use('/attachment', attachmentRoute);
app.use('/user', userroute);
app.use('/test', testRoute);

// Global error handler for CORS or other errors
app.use((err, req, res, next) => {
  console.error('=== GLOBAL ERROR ===');
  console.error('Error:', err.message);
  console.error('Stack:', err.stack);
  
  if (err.message === 'Not allowed by CORS') {
    return res.status(403).json({ message: err.message });
  }
  
  // Handle multer errors
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({ 
      success: false,
      message: 'File too large. Maximum size is 10MB per file.'
    });
  }
  
  if (err.code === 'LIMIT_FILE_COUNT') {
    return res.status(400).json({ 
      success: false,
      message: 'Too many files. Maximum 5 files per upload.'
    });
  }
  
  if (err.message && err.message.includes('Invalid file type')) {
    return res.status(400).json({ 
      success: false,
      message: err.message
    });
  }
  
  res.status(500).json({ 
    success: false,
    message: 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

app.listen(port, () => console.log(`Server started at ${port}`));