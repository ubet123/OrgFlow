const { json } = require('express');
const Tasks = require('../models/task');
const Users = require('../models/user');
const { cloudinary } = require('../config/cloudinary');
const { sendTaskAssignmentEmail, sendTaskCompletionEmail } = require('../services/nodemail');


//send email to employee when *Task is Assigned*
const mailToEmp = async (task, employeeName) => {
  try {
    console.log('Sending task assignment email to:', employeeName);
    
    const employee = await Users.findOne({ name: employeeName });
    if (!employee) {
      console.log('Employee not found:', employeeName);
      return false; // Don't throw error, just return false
    }

    const email = employee.email; 
    if (!email) {
      console.log('No email found for employee:', employeeName);
      return false;
    }

    // Check if task.dueDate exists and is valid
    let readableDate = 'Not specified';
    if (task.dueDate) {
      const isoDate = task.dueDate;
      readableDate = new Date(isoDate).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    }

    // Prepare task data for email
    const taskData = {
      taskId: task.taskId || 'N/A',
      title: task.title || 'New Task',
      description: task.description || 'No description provided',
      readableDate: readableDate
    };

    await sendTaskAssignmentEmail(email, taskData);

    console.log('Task assignment email sent successfully to:', email);
    return true;

  } catch (error) {
    console.error('Mail error in mailToEmp:', error);
    // Don't throw error, just return false
    return false;
  }
};



// Create Task controller (updated for attachments)
const createTask = async (req, res) => {
    try {
        // Debug: Log what's being received
        console.log('=== CREATE TASK REQUEST DEBUG ===');
        console.log('req.body:', req.body);
        console.log('req.files:', req.files);
        
        // Extract data from req.body (text fields are parsed by multer)
        const { taskId, title, description, assignedTo, dueDate } = req.body;
        
        console.log('Extracted fields:', { taskId, title, description, assignedTo, dueDate });
        
        // Filter files from req.files (if any)
        let files = [];
        if (req.files && req.files.length > 0) {
            // You can filter files if needed, but .any() accepts all files
            files = req.files;
            console.log(`Found ${files.length} files`);
        }
        
        // Validate required fields
        if (!taskId || !title || !description || !assignedTo || !dueDate) {
            console.log('Missing fields:', { taskId, title, description, assignedTo, dueDate });
            return res.status(400).json({ 
                success: false,
                message: 'All required fields must be provided'
            });
        }

        // Prepare task data
        const taskData = {
            taskId: taskId.trim(),
            title: title.trim(),
            assigned: assignedTo.trim(),
            due: new Date(dueDate),
            description: description.trim(),
            createdBy: req.user.id
        };

        console.log('Task data prepared:', taskData);

        // Add attachments if files were uploaded
        if (files.length > 0) {
            console.log(`Processing ${files.length} files`);
            
            taskData.attachments = files.map(file => ({
                public_id: file.filename,
                url: file.path,
                filename: file.originalname,
                mimetype: file.mimetype,
                size: file.size,
                uploadedBy: req.user.id
            }));
            
            console.log('Sample attachment:', taskData.attachments[0]);
        }

        // Create task
        console.log('Creating task in database...');
        const task = await Tasks.create(taskData);

        console.log('Task created successfully:', task.taskId);

        // Send email
        try {
            await mailToEmp({
                taskId: task.taskId,
                title: task.title,
                description: task.description,
                assignedTo: task.assigned,
                dueDate: task.due
            }, task.assigned);
            console.log('Task creation email sent successfully');
        } catch (emailError) {
            console.error('Email failed but task was created:', emailError);
        }

        return res.json({ 
            success: true,
            message: 'Task created successfully',
            task: {
                id: task._id,
                taskId: task.taskId,
                title: task.title,
                attachments: task.attachments?.map(att => ({
                    filename: att.filename,
                    url: att.url,
                    size: att.size
                })) || []
            }
        });

    } catch (error) {
        console.error('=== CREATE TASK ERROR ===');
        console.error('Error name:', error.name);
        console.error('Error message:', error.message);
        
        if (error.name === 'ValidationError') {
            console.error('Validation errors:', error.errors);
        }
        
        // Clean up uploaded files if error occurs
        if (req.files && req.files.length > 0) {
            try {
                console.log('Cleaning up uploaded files...');
                await Promise.all(
                    req.files.map(file => 
                        cloudinary.uploader.destroy(file.filename)
                    )
                );
                console.log('Files cleaned up');
            } catch (cleanupError) {
                console.error('Error cleaning up files:', cleanupError);
            }
        }

        // Send appropriate error response
        if (error.name === 'ValidationError') {
            return res.status(400).json({ 
                success: false,
                message: 'Task validation failed',
                error: 'Please check all required fields are filled correctly'
            });
        }

        return res.status(500).json({ 
            success: false,
            message: 'Error creating Task', 
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
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

// Get employee specific tasks controller
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

    // Format tasks with attachment info
    const tasksWithAttachments = usertasks.map(task => ({
      ...task.toObject(),
      hasAttachments: task.attachments && task.attachments.length > 0,
      attachmentCount: task.attachments ? task.attachments.length : 0
    }));

    console.log('usertasks in backend', tasksWithAttachments);
    
    res.json({
      success: true,
      tasks: tasksWithAttachments
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


// 
const editTask = async (req, res) => {
    try {
        const { taskId } = req.params;
        const updated = req.body;
        const userId = req.user.id;

        // Find the task
        let task = await Tasks.findOne({ taskId: taskId });
        if (!task) {
            return res.status(404).json({ 
                success: false,
                message: 'Task not found' 
            });
        }

        // Check if user has permission to edit
        if (req.user.role !== 'manager' && task.createdBy.toString() !== userId) {
            return res.status(403).json({ 
                success: false,
                message: 'You do not have permission to edit this task' 
            });
        }

        // Update basic task info
        const updatedTask = await Tasks.findOneAndUpdate(
            { taskId: taskId },
            { $set: updated },
            { new: true, runValidators: true }
        );

        res.status(200).json({
            success: true,
            message: `Task ${taskId} updated successfully`,
            task: updatedTask
        });

    } catch (error) {
        console.error('Error updating task:', error);
        res.status(500).json({ 
            success: false,
            message: 'Server error', 
            error: error.message 
        });
    }
};


//Delete Task Controller 
const deleteTask = async (req, res) => {
    try {
        const { taskId } = req.params;
        
        // Find the task first
        const task = await Tasks.findOne({ taskId: taskId });
        if (!task) {
            return res.status(404).json({ 
                success: false,
                message: 'Task not found' 
            });
        }

        // Delete all attachments from Cloudinary
        if (task.attachments && task.attachments.length > 0) {
            try {
                await Promise.all(
                    task.attachments.map(att => 
                        cloudinary.uploader.destroy(att.public_id)
                    )
                );
            } catch (cloudinaryError) {
                console.error('Error deleting files from Cloudinary:', cloudinaryError);
                // Continue with task deletion even if file deletion fails
            }
        }

        // Delete task from database
        await Tasks.findByIdAndDelete(task._id);

        res.status(200).json({
            success: true,
            message: `Task ${taskId} deleted successfully`
        });

    } catch (error) {
        console.error('Error deleting task:', error);
        res.status(500).json({ 
            success: false,
            message: 'Server error', 
            error: error.message 
        });
    }
};


// Add attachments to existing task
const addTaskAttachments = async (req, res) => {
    try {
        const { taskId } = req.params;
        const userId = req.user.id;

        // Find the task
        const task = await Tasks.findOne({ taskId: taskId });
        if (!task) {
            return res.status(404).json({
                success: false,
                message: 'Task not found'
            });
        }

        // Check if files were uploaded
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'No files uploaded'
            });
        }

        // Check total attachments limit
        const totalAttachments = task.attachments.length + req.files.length;
        if (totalAttachments > (process.env.MAX_FILES_PER_TASK || 5)) {
            return res.status(400).json({
                success: false,
                message: `Maximum ${process.env.MAX_FILES_PER_TASK || 5} attachments allowed per task`
            });
        }

        // Prepare attachments data
        const newAttachments = req.files.map(file => ({
            public_id: file.filename,
            url: file.path,
            filename: file.originalname,
            mimetype: file.mimetype,
            size: file.size,
            uploadedBy: userId
        }));

        // Add attachments to task
        task.attachments.push(...newAttachments);
        await task.save();

        res.status(200).json({
            success: true,
            message: 'Files uploaded successfully',
            attachments: newAttachments.map(att => ({
                filename: att.filename,
                url: att.url,
                size: att.size,
                mimetype: att.mimetype
            }))
        });

    } catch (error) {
        console.error('Error adding attachments:', error);
        
        // Clean up uploaded files if error occurs
        if (req.files && req.files.length > 0) {
            try {
                await Promise.all(
                    req.files.map(file => 
                        cloudinary.uploader.destroy(file.filename)
                    )
                );
            } catch (cleanupError) {
                console.error('Error cleaning up files:', cleanupError);
            }
        }

        res.status(500).json({
            success: false,
            message: 'Error uploading files',
            error: error.message
        });
    }
};

module.exports = {
  createTask,
  getAllTasks,
  getEmpTasks,
  completeTask,
  getAdminEmpTasks,
  editTask,
  deleteTask,
  addTaskAttachments
};