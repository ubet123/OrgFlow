const { json } = require('express');
const Tasks = require('../models/task');
const Users = require('../models/user');
const { sendTaskAssignmentEmail, sendTaskCompletionEmail } = require('../services/nodemail');

//send email to employee when *Task is Assigned*
const mailToEmp = async (task, employeeName) => {
  try {
    console.log('Sending task assignment email to:', employeeName);
    
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

    // Prepare task data for email
    const taskData = {
      taskId: task.taskId,
      title: task.title,
      description: task.description,
      readableDate: readableDate
    };

   try {
  await sendTaskAssignmentEmail(email, taskData);
} catch (emailError) {
  console.error('Email failed but continuing:', emailError.message);
  // Don't throw - continue with task creation
}


    console.log('Task assignment email sent successfully to:', email);
    return true;

  } catch (error) {
    console.error('Mail error in mailToEmp:', error);
    throw error; 
  }
};

//Create Task controller
const createTask = async (req, res) => {
  const { taskId, title, description, assignedTo, dueDate } = req.body;

  try {
    // Create task first
    await Tasks.create({
      taskId: taskId,
      title: title,
      assigned: assignedTo,
      due: dueDate,
      description: description
    });

    console.log('Task created successfully, now sending email...');

    // Send email (but don't let email failure break task creation)
    try {
      await mailToEmp(req.body, assignedTo);
      console.log('Task creation email sent successfully');
    } catch (emailError) {
      console.error('Email failed but task was created:', emailError);
      // Don't throw error - task was created successfully
    }

    return res.json({ 
      success: true,
      message: 'Task created successfully' 
    });

  } catch (error) {
    console.error('Error creating task:', error);
    return res.status(500).json({ 
      success: false,
      message: 'Error creating Task', 
      error: error.message 
    });
  }
};

//Get all tasks for admin controller
const getAllTasks = async (req, res) => {
  try {
    const tasks = await Tasks.find({});
    res.json({ 
      success: true,
      tasks 
    });
  } catch (error) {
    console.error('Error fetching Tasks:', error);
    return res.status(500).json({ 
      success: false,
      message: 'Error Fetching Tasks', 
      error: error.message 
    });
  }
};

//Get employee specific tasks controller
const getEmpTasks = async (req, res) => {
  try {
    const user = await Users.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: 'User not found' 
      });
    }

    const usertasks = await Tasks.find({ assigned: user.name });

    console.log('usertasks in backend', usertasks);
    
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
};

//Mark task as completed controller
const completeTask = async (req, res) => {
  try {
    const { taskId } = req.body;
    
    // Update task status first
    await Tasks.updateOne(
      { taskId: taskId }, 
      { $set: { status: 'Completed' } }
    );
    
    const taskInfo = await Tasks.findOne({ taskId: taskId });

    // Send completion email 
    try {
      const taskData = {
        taskId: taskId,
        assigned: taskInfo.assigned
      };

      // Send email to manager
      await sendTaskCompletionEmail('dmelloserene08@gmail.com', taskData);
      console.log(' Task completion email sent successfully');
      
    } catch (emailError) {
      console.error(' Completion email failed:', emailError.message);
      // Don't throw error - task was completed successfully
    }

    res.json({
      success: true,
      message: `Task ${taskId} marked as completed`
    });

  } catch (error) {
    console.error('Error marking task as complete:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error marking task as complete', 
      error: error.message 
    });
  }
};


//Employee specific tasks for admin controller
const getAdminEmpTasks = async (req, res) => {
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
};


//Edit Task controller

const editTask = async (req,res)=>{
  console.log('updated task',req.body);
  
  try {
    const {taskId} = req.params;

const updated = req.body;

 const task = await Tasks.findOneAndUpdate(
      { taskId: taskId },
      { $set: updated },
      { new: true, runValidators: true }
    );

  if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

   res.status(200).json({
      message: `Task ${taskId} updated successfully`,
      task: task
    });

  } catch (error) {
     console.error('Error updating task:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }

  
}


//Delete Task Controller 

const deleteTask= async (req,res)=>{
  
  
try {
  const {taskId} = req.params
  console.log('to be deleted task:',taskId);
  await Tasks.findByIdAndDelete(taskId)

  res.status(200).json({message:`Task ${taskId} Deleted Successfully`})

} catch (error) {
  console.error('Error deleting task:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
}

}

module.exports = {
  createTask,
  getAllTasks,
  getEmpTasks,
  completeTask,
  getAdminEmpTasks,
  editTask,
  deleteTask
};