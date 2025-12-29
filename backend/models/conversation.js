const mongoose = require('mongoose');
const User = require('../models/user.js');
const Message = require('../models/message.js');

const conversationSchema = new mongoose.Schema({
participants: [
{
type: mongoose.Schema.Types.ObjectId,
ref: User,
},
],
messages: [
{
type: mongoose.Schema.Types.ObjectId,
ref: Message,
default: [],
},
],
}, { timestamps: true });

const Conversation = mongoose.model('Conversation', conversationSchema);

module.exports = { Conversation };