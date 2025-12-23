const Task = require('../models/task');
const User = require('../models/user');
const { cloudinary } = require('../config/cloudinary');

// Add attachments to task
const addAttachments = async (req, res) => {
    try {
        const { taskId } = req.params;
        const userId = req.user.id;

        // Check if files were uploaded
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'No files uploaded'
            });
        }

        // Find the task
        const task = await Task.findOne({ taskId: taskId });
        if (!task) {
            return res.status(404).json({
                success: false,
                message: 'Task not found'
            });
        }

        // Check if user has permission (must be admin or task creator)
        if (req.user.role !== 'manager' && task.createdBy.toString() !== userId) {
            return res.status(403).json({
                success: false,
                message: 'You do not have permission to add attachments to this task'
            });
        }

        // Check total attachments limit
        const totalAttachments = task.attachments.length + req.files.length;
        if (totalAttachments > process.env.MAX_FILES_PER_TASK || 5) {
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

// Remove attachment from task
const removeAttachment = async (req, res) => {
    try {
        const { taskId, publicId } = req.params;
        const userId = req.user.id;

        // Find the task
        const task = await Task.findOne({ taskId: taskId });
        if (!task) {
            return res.status(404).json({
                success: false,
                message: 'Task not found'
            });
        }

        // Check if user has permission
        if (req.user.role !== 'manager' && task.createdBy.toString() !== userId) {
            return res.status(403).json({
                success: false,
                message: 'You do not have permission to remove attachments from this task'
            });
        }

        // Find the attachment
        const attachment = task.attachments.find(
            att => att.public_id === publicId
        );

        if (!attachment) {
            return res.status(404).json({
                success: false,
                message: 'Attachment not found'
            });
        }

        // Delete from Cloudinary
        await cloudinary.uploader.destroy(publicId);

        // Remove from task
        task.attachments = task.attachments.filter(
            att => att.public_id !== publicId
        );
        await task.save();

        res.status(200).json({
            success: true,
            message: 'Attachment removed successfully'
        });

    } catch (error) {
        console.error('Error removing attachment:', error);
        res.status(500).json({
            success: false,
            message: 'Error removing attachment',
            error: error.message
        });
    }
};

// Get task attachments (with access control)
const getTaskAttachments = async (req, res) => {
    try {
        const { taskId } = req.params;
        const userId = req.user.id;
        const userRole = req.user.role;

        // Find the task
        const task = await Task.findOne({ taskId: taskId })
            .populate('createdBy', 'name email')
            .populate('attachments.uploadedBy', 'name');

        if (!task) {
            return res.status(404).json({
                success: false,
                message: 'Task not found'
            });
        }

        // Check access: admin or assigned employee
        const user = await User.findById(userId);
        if (userRole !== 'manager' && task.assigned !== user.name) {
            return res.status(403).json({
                success: false,
                message: 'You do not have permission to view attachments for this task'
            });
        }

        // Format attachments for response
        const attachments = task.attachments.map(att => ({
            id: att.public_id,
            filename: att.filename,
            url: att.url,
            size: att.size,
            mimetype: att.mimetype,
            uploadedBy: att.uploadedBy?.name || 'Unknown',
            uploadedAt: att.uploadedAt
        }));

        res.status(200).json({
            success: true,
            taskId: task.taskId,
            taskTitle: task.title,
            attachments: attachments,
            totalAttachments: attachments.length
        });

    } catch (error) {
        console.error('Error fetching attachments:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching attachments',
            error: error.message
        });
    }
};

// Get single attachment (with access control)
const getAttachment = async (req, res) => {
  try {
    const { taskId, publicId } = req.params;
    const userId = req.user.id;
    const userRole = req.user.role;

    // Find the task
    const task = await Task.findOne({ taskId: taskId });
    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    // Check access
    const user = await User.findById(userId);
    if (userRole !== 'manager' && task.assigned !== user.name) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to access this attachment'
      });
    }

    // Find the attachment
    const attachment = task.attachments.find(
      att => att.public_id === publicId
    );

    if (!attachment) {
      return res.status(404).json({
        success: false,
        message: 'Attachment not found'
      });
    }

    // Generate a signed URL that expires in 1 hour
    const signedUrl = cloudinary.url(attachment.public_id, {
      secure: true,
      resource_type: 'raw', // Explicitly set to raw for PDFs
      sign_url: true, // Sign the URL
      expires_at: Math.floor(Date.now() / 1000) + 3600, // 1 hour from now
      flags: "attachment",
      attachment: attachment.filename
    });

    res.redirect(signedUrl);

  } catch (error) {
    console.error('Error getting attachment:', error);
    res.status(500).json({
      success: false,
      message: 'Error getting attachment',
      error: error.message
    });
  }
};


const getEmployeeTaskAttachments = async (req, res) => {
    try {
        const { taskId } = req.params;
        const userId = req.user.id;
        const userRole = req.user.role;

        // Find the task
        const task = await Task.findOne({ taskId: taskId })
            .populate('attachments.uploadedBy', 'name employeeId');

        if (!task) {
            return res.status(404).json({
                success: false,
                message: 'Task not found'
            });
        }

        // Check access: employee must be assigned to this task
        const user = await User.findById(userId);
        if (userRole !== 'manager' && task.assigned !== user.name) {
            return res.status(403).json({
                success: false,
                message: 'You do not have permission to view attachments for this task'
            });
        }

        // Format attachments for response
        const attachments = task.attachments.map(att => ({
            id: att.public_id,
            filename: att.filename,
            url: att.url,
            size: att.size,
            mimetype: att.mimetype,
            fileType: getFileTypeFromMime(att.mimetype),
            uploadedBy: att.uploadedBy?.name || 'Manager',
            uploadedAt: att.uploadedAt,
            isImage: att.mimetype.startsWith('image/'),
            isPDF: att.mimetype === 'application/pdf',
            isDocument: att.mimetype.includes('word') || att.mimetype.includes('document'),
            isSpreadsheet: att.mimetype.includes('excel') || att.mimetype.includes('spreadsheet'),
            isPresentation: att.mimetype.includes('powerpoint') || att.mimetype.includes('presentation')
        }));

        res.status(200).json({
            success: true,
            taskId: task.taskId,
            taskTitle: task.title,
            attachments: attachments,
            totalAttachments: attachments.length,
            hasAttachments: attachments.length > 0
        });

    } catch (error) {
        console.error('Error fetching task attachments:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching attachments',
            error: error.message
        });
    }
};

const getFileTypeFromMime = (mimetype) => {
    if (mimetype.startsWith('image/')) return 'image';
    if (mimetype === 'application/pdf') return 'pdf';
    if (mimetype.includes('word') || mimetype.includes('document')) return 'document';
    if (mimetype.includes('excel') || mimetype.includes('spreadsheet')) return 'spreadsheet';
    if (mimetype.includes('powerpoint') || mimetype.includes('presentation')) return 'presentation';
    if (mimetype.startsWith('text/')) return 'text';
    return 'other';
};

// Download attachment
const downloadAttachment = async (req, res) => {
    try {
        const { taskId, attachmentId } = req.params;
        const userId = req.user.id;
        const userRole = req.user.role;

        // Find the task
        const task = await Task.findOne({ taskId: taskId });
        if (!task) {
            return res.status(404).json({
                success: false,
                message: 'Task not found'
            });
        }

        // Check access
        const user = await User.findById(userId);
        if (userRole !== 'manager' && task.assigned !== user.name) {
            return res.status(403).json({
                success: false,
                message: 'Access denied'
            });
        }

        // Find the attachment - match by public_id
        const attachment = task.attachments.find(
            att => att.public_id === attachmentId
        );

        if (!attachment) {
            // Try to find without folder path (fallback)
            const attachmentWithoutFolder = task.attachments.find(
                att => att.public_id.includes(attachmentId)
            );
            
            if (!attachmentWithoutFolder) {
                return res.status(404).json({
                    success: false,
                    message: 'Attachment not found'
                });
            }
            
            // Set the found attachment
            attachment = attachmentWithoutFolder;
        }

        // Create secure download URL
        const downloadUrl = cloudinary.url(attachment.public_id, {
            secure: true,
            flags: "attachment",
            attachment: attachment.filename
        });

        // Redirect to Cloudinary download URL
        res.redirect(downloadUrl);

    } catch (error) {
        console.error('Error downloading attachment:', error);
        res.status(500).json({
            success: false,
            message: 'Error downloading file',
            error: error.message
        });
    }
};


module.exports = {
    addAttachments,
    removeAttachment,
    getTaskAttachments,
    getAttachment,
    getEmployeeTaskAttachments,
    downloadAttachment
};