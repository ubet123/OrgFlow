const express = require("express");
const router = express.Router();
const { verifyToken, requireAdmin } = require('../utils/auth');
const {
  getEmployees,
  getAllEmployees,
  getManager,
  createEmployee,
  deleteEmployee,
  updateEmployee
} = require('../controllers/userController');

//get all employees 
router.get('/employees', requireAdmin, getEmployees);

//get all employees (full details)
router.get('/allemployees', requireAdmin, getAllEmployees);

//get manager (for employees)
router.get('/manager', verifyToken, getManager);

//create employee
router.post('/create', requireAdmin, createEmployee);

//delete employee and their tasks
router.delete('/delete/:id', requireAdmin, deleteEmployee);

//update employee details
router.patch('/update/:id', requireAdmin, updateEmployee);

module.exports = router;