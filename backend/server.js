const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const loginroute = require('./routes/login');
const taskroute = require('./routes/task');
const userroute = require('./routes/user');

const port = process.env.PORT || 3001;

// Database connection
mongoose.connect(process.env.MONGO_CONNECTION, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log('MongoDB connected'))
  .catch(error => console.error(`MongoDB connection failed: ${error}`));

// Middleware
const allowedOrigins = [
  'http://localhost:5173',                     // local frontend
  'https://org-flow-six.vercel.app',          // deployed frontend
  'https://orgflow-backend.onrender.com'      // backend domain itself if needed
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (Postman, server-to-server)
    if (!origin) return callback(null, true);

    // Allow all in development
    if (process.env.NODE_ENV !== 'production') {
      return callback(null, true);
    }

    // Allow only listed origins in production
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      return callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true, // allow cookies
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Routes
app.use('/auth', loginroute);
app.use('/task', taskroute);
app.use('/user', userroute);

// Global error handler for CORS or other errors
app.use((err, req, res, next) => {
  if (err.message === 'Not allowed by CORS') {
    return res.status(403).json({ message: err.message });
  }
  console.error(err);
  res.status(500).json({ message: 'Internal Server Error' });
});

app.listen(port, () => console.log(`Server started at ${port}`));
