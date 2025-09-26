const express = require("express");
const app = express();
const router = express.Router();

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
const isoDate = task.dueDate;
const readableDate = new Date(isoDate).toLocaleDateString('en-US', {
  year: 'numeric',
  month: 'long',
  day: 'numeric'
});

   
    await sendMail(
  email,
  `New Task Assigned - OrgFlow (Task ID: ${task.taskId})`,
  `
    <h2 style="color:#2c3e50;">Hello,</h2>
    <p>
      A new task has been assigned to you in <b>OrgFlow</b>. Please review the details below:
    </p>
    
    <h3 style="color:#16a34a;">${task.title}</h3>
    <p>
      <b>Task ID:</b> ${task.taskId} <br/>
      <b>Description:</b> ${task.description} <br/>
      <b>Due Date:</b> <span style="color:#e63946;">${readableDate}</span>
    </p>

    <p>
      Kindly make sure to complete the task by the due date. You can view and update the task 
      status anytime on the <b>OrgFlow</b> platform.
    </p>
    
    <br/>
    <p>
      Wishing you the best for successful completion.
    </p>
    <p style="color:#7f8c8d; font-size: 0.9rem;">
      — OrgFlow Task Management System
    </p>
  `
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
       await sendMail(
  'dmelloserene08@gmail.com',
  `Task ${taskId} Completion Notification - OrgFlow`,
  `
    <h2 style="color:#2c3e50;">Hello Manager,</h2>
    <p>
      We would like to inform you that <b>Task ID: ${taskId}</b> has been successfully marked as 
      <span style="color:green;font-weight:bold;">Completed</span>.
    </p>
    <p>
      <b>Assigned Employee:</b> ${taskInfo.assigned} <br/>
      <b>Completion Time:</b> ${new Date().toLocaleString()}
    </p>
    <p>
      Please review the task details at your earliest convenience on the <b>OrgFlow</b> platform.
    </p>
    <br/>
    <p>
      Thank you for using <b>OrgFlow</b> to manage your team’s workflow efficiently.
    </p>
    <p style="color:#7f8c8d; font-size: 0.9rem;">
      — OrgFlow Task Management System
    </p>
  `
);


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