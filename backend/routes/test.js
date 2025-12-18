const express = require('express');
const router = express.Router();
const { sendTaskAssignmentEmail } = require('../services/nodemail');

router.get('/test-email', async (req, res) => {
  try {
    const testData = {
      taskId: 'TEST-001',
      title: 'Test Task',
      description: 'This is a test email',
      readableDate: new Date().toLocaleDateString()
    };
    
    await sendTaskAssignmentEmail(
      process.env.NODE_MAILER_GMAIL, // Send to yourself
      testData
    );
    
    res.json({ 
      success: true, 
      message: 'Test email sent successfully' 
    });
  } catch (error) {
    console.error('Test failed:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

module.exports = router;