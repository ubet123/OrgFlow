const express = require("express");
const router = express.Router();
const { verifyToken, requireAdmin } = require('../utils/auth');
const { upload } = require('../config/cloudinary');
const {
    addAttachments,
    removeAttachment,
    getTaskAttachments,
    getAttachment,
    getEmployeeTaskAttachments,
    downloadAttachment
} = require('../controllers/attachmentController');

// Add attachments to existing task (Admin/Manager only)
router.post('/:taskId/attachments', 
    requireAdmin, 
    upload.any(), // Use .any() here
    addAttachments
);

// Remove attachment from task (Admin/Manager only)
router.delete('/:taskId/attachments/:publicId', requireAdmin, removeAttachment);

// Get all attachments for a task (Admin or assigned employee)
router.get('/:taskId/attachments', verifyToken, getTaskAttachments);

// Get/download single attachment (Admin or assigned employee)
router.get('/:taskId/attachments/:publicId/download', verifyToken, getAttachment);

// Get attachments for a specific task (employee access)
router.get('/employee/:taskId/attachments', verifyToken, getEmployeeTaskAttachments);

// Download attachment (employee access)
router.get('/employee/:taskId/attachments/:attachmentId/download', verifyToken, downloadAttachment);

module.exports = router;