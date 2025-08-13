const express = require('express')
const router = express.Router()
const Tasks = require('../models/task')
const { verifyToken } = require('../utils/auth') 
const Users= require('../models/user')
const sendMail = require('../services/nodemail')

//send email to employee when *Task is Assigned*
const mailToEmp = async (task, employeeName) => {
  try {
    
    const employee = await Users.findOne({ name: employeeName });
    if (!employee) {
      throw new Error('Employee not found');
    }

    const email = employee.email; 
    if (!email) {
      throw new Error('No email found for employee');
    }

   
    await sendMail(
      email,
      'Task Assigned on OrgFlow',
      `<h1>${task.title}</h1><h3>Task ID:${task.taskId}</h3><p><b>Task Description</b>:${task.description}</p>`
    );
  } catch (error) {
    console.error('Mail error:', error);
    throw error; 
  }
};

//Create Task 
router.post('/create',verifyToken, async(req,res)=>{
    const {taskId,title,description,assignedTo,dueDate} = req.body

    try {
        
        await Tasks.create({taskId:taskId,title:title,assigned:assignedTo,due:dueDate,description:description})
        
       await mailToEmp(req.body,assignedTo);

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


//Mark task as completed
router.patch("/complete",verifyToken,async (req,res)=>{
    try {
        const {taskId} = req.body
        await Tasks.updateOne({taskId:taskId},{$set:{status:'Completed'}});
        const taskInfo= await Tasks.findOne({taskId:taskId})

        //Send Email to manager regarding Task Completion
       await sendMail('dmelloserene08@gmail.com',`Task ${taskId} Completed on Orgflow `,`<h2>Hello Manager</h2> <p>Task ${taskId} has been <b>Completed</b> by <b>${taskInfo.assigned} . <br/> Thank You  `)

        res.json({message:`Task ${taskId} marked as completed`})
      

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