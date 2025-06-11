const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  employeeId: { type: String, required: true, unique: true }, // Manager provides this
  password: { type: String, required: true }, 
  role: { 
    type: String, 
    enum: ['developer', 'tester', 'business', 'manager'], 
    required: true 
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);