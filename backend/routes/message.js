const express = require('express');
const router = express.Router();

const { sendMessage, getMessage } = require('../controllers/message.js');
const { verifyToken } = require('../utils/auth.js');


router.post('/send/:id', verifyToken, sendMessage);
router.get('/get/:id', verifyToken, getMessage);



module.exports = router;