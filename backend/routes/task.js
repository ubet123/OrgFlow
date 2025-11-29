const express = require("express");
const router = express.Router();
const { verifyToken, requireAdmin } = require('../utils/auth');
const {
  createTask,
  getAllTasks,
  getEmpTasks,
  completeTask,
  getAdminEmpTasks
} = require('../controllers/taskController');

//Create Task 
router.post('/create', requireAdmin, createTask);

//Get all tasks 
router.get('/alltasks', requireAdmin, getAllTasks);

//Get employee specific tasks 
router.get('/emptasks', verifyToken, getEmpTasks);

//Mark task as completed 
router.patch("/complete", verifyToken, completeTask);

//Employee specific tasks for admin
router.get('/adminemptasks', requireAdmin, getAdminEmpTasks);

module.exports = router;