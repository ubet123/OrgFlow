const express = require('express')
const app = express()
const mongoose = require('mongoose')
const cors = require('cors')
const cookieParser = require('cookie-parser') 

const loginroute = require('./routes/login')
const taskroute = require('./routes/task')
const userroute = require('./routes/user')

const port = 3001

// Database connection
mongoose.connect('mongodb://127.0.0.1:27017/orgflow')
  .then(() => console.log('MongoDB connected'))
  .catch(error => console.log(`MongoDB connection failed: ${error}`))

// Middleware
app.use(cors({
  origin: 'http://localhost:5173', 
  credentials: true 
}))
app.use(cookieParser()) 
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

// Routes
app.use('/auth', loginroute)
app.use('/task', taskroute)
app.use('/user', userroute)

app.listen(port, () => console.log(`Server started at ${port}`))