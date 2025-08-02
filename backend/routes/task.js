const express = require('express')
const router = express.Router()
const Tasks = require('../models/task')
const { verifyToken } = require('../utils/auth') 
const Users= require('../models/user')



router.post('/create',verifyToken, async(req,res)=>{
    const {taskId,title,description,assignedTo,dueDate} = req.body

    try {
        
        await Tasks.create({taskId:taskId,title:title,assigned:assignedTo,due:dueDate,description:description})
        return res.json({message:'Task created successfully'})
    } catch (error) {
        return res.status(500).json({ msg: 'Error creating Task', error });
    }

})

router.get('/alltasks',verifyToken,async(req,res)=>{
    try {
        const tasks = await Tasks.find({})
        res.json({tasks})
    } catch (error) {
        console.error('Error fetching Tasks:', error);
        return res.status(500).json({ 
            msg: 'Error Fetching Tasks', 
            error: error.message 
        });
        
    }
})

router.get('/emptasks', verifyToken, async (req, res) => {
  try {
    // 1. Get the authenticated user's data
    const user = await Users.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: 'User not found' 
      });
    }
 
    // 2. Find tasks assigned to this user by name
    const usertasks = await Tasks.find({ assigned: user.name });

    console.log('usertasks in backend',usertasks);
    
    
    // 3. Return the tasks
    res.json({
      success: true,
      tasks: usertasks
    });
    
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error fetching tasks',
      error: error.message 
    });
  }
});

router.patch("/complete",verifyToken,async (req,res)=>{
    try {
        const {taskId} = req.body
        await Tasks.updateOne({taskId:taskId},{$set:{status:'Completed'}})
        res.json({message:`task ${taskId} marked as completed`})

    } catch (error) {
        console.error('Error marking task as complete:', error);
        res.status(500).json({ 
            msg: 'Error marking task as complete', 
            error: error.message 
        });
    }
})


router.get('/adminemptasks',async (req, res) => {
  try {
    // Extract the employee name from query parameters
    const employeeName = req.query.employee;
    
    if (!employeeName) {
      return res.status(400).json({
        success: false,
        message: 'Employee name parameter is required'
      });
    }

    // Find tasks assigned to this employee
    const tasks = await Tasks.find({ assigned: employeeName });
    
    res.json({
      success: true,
      tasks: tasks
    });
    
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching tasks',
      error: error.message
    });
  }
});

module.exports=router