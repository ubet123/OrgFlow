const express = require('express');
// const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const {app,server} = require('./SocketIO/server.js');


// Route imports
const loginroute = require('./routes/login');
const taskroute = require('./routes/task');
const userroute = require('./routes/user');
const attachmentRoute = require('./routes/attachment');
const messageRoute = require('./routes/message');


// Middleware imports
const errorHandler = require('./middleware/errorHandler');
const dynamicBodyParser = require('./middleware/bodyParser');
const corsOptions = require('./middleware/cors');

const port = process.env.PORT || 3001;

// Database connection
mongoose.connect(process.env.MONGO_CONNECTION, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log('MongoDB connected'))
  .catch(error => console.error(`MongoDB connection failed: ${error}`));

// Middleware
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(dynamicBodyParser);

// Routes
app.use('/auth', loginroute);
app.use('/task', taskroute);
app.use('/attachment', attachmentRoute);
app.use('/user', userroute);
app.use('/message', messageRoute);

// Error handler
app.use(errorHandler);

server.listen(port, () => console.log(`Server started at ${port}`));