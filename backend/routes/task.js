const express = require('express')
const router = express.Router()
const Tasks = require('../models/task')
const { verifyToken } = require('../utils/auth') 
const Users= require('../models/user')


//Create Task 
router.post('/create',verifyToken, async(req,res)=>{
    const {taskId,title,description,assignedTo,dueDate} = req.body

    try {
        
        await Tasks.create({taskId:taskId,title:title,assigned:assignedTo,due:dueDate,description:description})
        return res.json({message:'Task created successfully'})
    } catch (error) {
        return res.status(500).json({ msg: 'Error creating Task', error });
    }

})


//Get all tasks for admin
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


//Get employee specific tasks
router.get('/emptasks', verifyToken, async (req, res) => {
  try {
  
    const user = await Users.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: 'User not found' 
      });
    }
 
    
    const usertasks = await Tasks.find({ assigned: user.name });

    console.log('usertasks in backend',usertasks);
    
    
   
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


//Mark task as complete
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

//Employee specific tasks for admin
router.get('/adminemptasks',async (req, res) => {
  try {
   
    const employeeName = req.query.employee;
    
    if (!employeeName) {
      return res.status(400).json({
        success: false,
        message: 'Employee name parameter is required'
      });
    }

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