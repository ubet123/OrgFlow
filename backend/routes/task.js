const express = require("express");
const router = express.Router();
const { verifyToken, requireAdmin } = require('../utils/auth');
const { upload } = require('../config/cloudinary');  
const {
  createTask,
  getAllTasks,
  getEmpTasks,
  completeTask,
  getAdminEmpTasks,
  editTask,
  deleteTask,
  addTaskAttachments
} = require('../controllers/taskController');

// Create Task with attachments
router.post('/create', 
  requireAdmin,
  upload.any(), // Use .any() here
  createTask
);

// Add attachments to existing task
router.post('/:taskId/add-attachments',
  requireAdmin,
  upload.any(), // Use .any() here
  addTaskAttachments
);


// Get all tasks 
router.get('/alltasks', requireAdmin, getAllTasks);

// Get employee specific tasks 
router.get('/emptasks', verifyToken, getEmpTasks);

// Mark task as completed 
router.patch("/complete", verifyToken, completeTask);

// Employee specific tasks for admin
router.get('/adminemptasks', requireAdmin, getAdminEmpTasks);

// Edit Task by Admin
router.put('/edittask/:taskId', requireAdmin, editTask);

// Delete Task by Admin
router.delete('/deleteTask/:taskId', requireAdmin, deleteTask);

module.exports = router;