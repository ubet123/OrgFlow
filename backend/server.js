const express = require('express')
const app = express()
const mongoose = require('mongoose')
const cors = require('cors')
const cookieParser = require('cookie-parser') 

const loginroute = require('./routes/login')
const taskroute = require('./routes/task')
const userroute = require('./routes/user')

const port = process.env.PORT || 3001

// Database connection
mongoose.connect(process.env.MONGO_CONNECTION)
  .then(() => console.log('MongoDB connected'))
  .catch(error => console.log(`MongoDB connection failed: ${error}`))

// Middleware
app.use(cors({
  origin: function (origin, callback) {
    // Allow all origins in development, specific origins in production
    if (process.env.NODE_ENV !== 'production') {
      callback(null, true)
    } else {
      const allowedOrigins = [
        'https://org-flow-six.vercel.app', // Your Vercel frontend URL
        'https://org-flow-six.vercel.app',
        'https://orgflow-backend.onrender.com'          // Your production domain
      ]
      if (allowedOrigins.includes(origin) || !origin) {
        callback(null, true)
      } else {
        callback(new Error('Not allowed by CORS'))
      }
    }
  },
  credentials: true, // This allows cookies to be sent
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}))

app.use(cookieParser()) 
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

// Routes
app.use('/auth', loginroute)
app.use('/task', taskroute)
app.use('/user', userroute)

app.listen(port, () => console.log(`Server started at ${port}`))