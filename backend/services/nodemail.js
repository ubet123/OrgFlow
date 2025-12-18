// services/emailService.js
const nodemailer = require('nodemailer');

// Create reusable transporter with Render-compatible settings
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465, // Changed from 587 to 465 (more likely to work on Render)
  secure: true, // true for 465, false for 587
  auth: {
    user: process.env.NODE_MAILER_GMAIL,
    pass: process.env.NODE_MAILER_PASS
  },
  tls: {
    rejectUnauthorized: false // Important for Render
  },
  connectionTimeout: 30000, // Increase timeout
  socketTimeout: 30000,
  greetingTimeout: 30000
});

// Verify transporter
transporter.verify((error, success) => {
  if (error) {
    console.error('❌ Email setup error:', error.message);
    console.error('Error details:', {
      code: error.code,
      command: error.command,
      response: error.response
    });
  } else {
    console.log('✅ Email service ready');
    console.log('SMTP Config:', {
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      hasUser: !!process.env.NODE_MAILER_GMAIL,
      hasPass: !!process.env.NODE_MAILER_PASS
    });
  }
});

// Send task assignment email
const sendTaskAssignmentEmail = async (toEmail, taskData) => {
  try {
    console.log(`📧 Attempting to send task assignment to: ${toEmail}`);
    
    const mailOptions = {
      from: `"OrgFlow" <${process.env.NODE_MAILER_GMAIL}>`,
      to: toEmail,
      subject: `New Task Assigned: ${taskData.title}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
          <div style="background: linear-gradient(135deg, #4F46E5, #7C73E6); padding: 20px; border-radius: 8px 8px 0 0; text-align: center;">
            <h1 style="color: white; margin: 0;">🎯 New Task Assigned</h1>
          </div>
          
          <div style="padding: 25px; background: #f9fafb;">
            <p style="color: #4b5563; margin-bottom: 20px;">Hello, you have been assigned a new task in OrgFlow:</p>
            
            <div style="background: white; padding: 20px; border-radius: 8px; border-left: 4px solid #4F46E5; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
              <h2 style="color: #1f2937; margin-top: 0;">${taskData.title}</h2>
              
              <div style="margin-bottom: 15px;">
                <span style="display: inline-block; background: #f3f4f6; padding: 4px 12px; border-radius: 20px; font-size: 14px; color: #4b5563; margin-right: 10px;">
                  📋 Task ID: ${taskData.taskId}
                </span>
                <span style="display: inline-block; background: #fef3c7; padding: 4px 12px; border-radius: 20px; font-size: 14px; color: #92400e;">
                  📅 Due: ${taskData.readableDate}
                </span>
              </div>
              
              <div style="background: #f8fafc; padding: 15px; border-radius: 6px; margin: 15px 0;">
                <p style="margin: 0; color: #4b5563;"><strong>Description:</strong> ${taskData.description}</p>
              </div>
              
              <div style="background: #f0f9ff; padding: 12px; border-radius: 6px; margin: 15px 0;">
                <p style="margin: 0; color: #0369a1; font-size: 14px;">
                  <strong>Status:</strong> <span style="color: #dc2626; font-weight: bold;">Pending</span>
                </p>
              </div>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.FRONTEND_URL || 'https://org-flow-six.vercel.app'}" 
                 style="background: linear-gradient(135deg, #4F46E5, #7C73E6); color: white; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px; display: inline-block; box-shadow: 0 4px 6px rgba(79, 70, 229, 0.2);">
                👉 View Task in OrgFlow
              </a>
            </div>
            
          </div>
          
          <div style="border-top: 1px solid #e5e7eb; padding: 20px; text-align: center; color: #6b7280; font-size: 12px;">
            <p style="margin: 0;">This is an automated notification from OrgFlow Task Management System</p>
            <p style="margin: 5px 0 0 0;">© ${new Date().getFullYear()} OrgFlow. All rights reserved.</p>
          </div>
        </div>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Task assignment email sent successfully:', info.messageId);
    return info;
  } catch (error) {
    console.error('❌ Task assignment email error:', error.message);
    console.error('Error details:', error);
    throw error;
  }
};

// Send task completion email
const sendTaskCompletionEmail = async (toEmail, taskData) => {
  try {
    console.log(`📧 Attempting to send completion email to: ${toEmail}`);
    
    const currentDate = new Date().toLocaleString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    const mailOptions = {
      from: `"OrgFlow" <${process.env.NODE_MAILER_GMAIL}>`,
      to: toEmail,
      subject: `✅ Task Completed: ${taskData.taskId}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
          <div style="background: linear-gradient(135deg, #10B981, #34D399); padding: 20px; border-radius: 8px 8px 0 0; text-align: center;">
            <h1 style="color: white; margin: 0;">✅ Task Completed Successfully</h1>
          </div>
          
          <div style="padding: 25px; background: #f9fafb;">
            <p style="color: #4b5563; margin-bottom: 20px;">Hello Manager, a task has been marked as completed in OrgFlow:</p>
            
            <div style="background: white; padding: 20px; border-radius: 8px; border-left: 4px solid #10B981; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
              <div style="text-align: center; margin-bottom: 20px;">
                <div style="background: #d1fae5; width: 80px; height: 80px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; margin: 0 auto;">
                  <span style="font-size: 40px;">✅</span>
                </div>
              </div>
              
              <h2 style="color: #1f2937; text-align: center; margin-top: 0;">Task ${taskData.taskId}</h2>
              
              <div style="display: flex; justify-content: center; gap: 20px; margin: 20px 0; flex-wrap: wrap;">
                <div style="text-align: center;">
                  <div style="font-size: 12px; color: #6b7280; margin-bottom: 5px;">Completed By</div>
                  <div style="font-weight: bold; color: #1f2937; background: #f3f4f6; padding: 8px 16px; border-radius: 6px;">
                    👤 ${taskData.assigned}
                  </div>
                </div>
                
                <div style="text-align: center;">
                  <div style="font-size: 12px; color: #6b7280; margin-bottom: 5px;">Completed At</div>
                  <div style="font-weight: bold; color: #1f2937; background: #f3f4f6; padding: 8px 16px; border-radius: 6px;">
                    🕒 ${currentDate}
                  </div>
                </div>
              </div>
              
              <div style="background: #ecfdf5; padding: 15px; border-radius: 6px; margin: 20px 0; text-align: center;">
                <p style="margin: 0; color: #065f46; font-weight: bold;">
                  🎉 This task is now marked as <span style="color: #059669;">COMPLETED</span>
                </p>
              </div>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.FRONTEND_URL || 'https://org-flow-six.vercel.app'}" 
                 style="background: linear-gradient(135deg, #10B981, #34D399); color: white; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px; display: inline-block; box-shadow: 0 4px 6px rgba(16, 185, 129, 0.2);">
                👉 View in OrgFlow Dashboard
              </a>
            </div>
            
            <p style="color: #6b7280; font-size: 14px; text-align: center;">
              Click the button above to review completed tasks in your dashboard
            </p>
          </div>
          
          <div style="border-top: 1px solid #e5e7eb; padding: 20px; text-align: center; color: #6b7280; font-size: 12px;">
            <p style="margin: 0;">This is an automated notification from OrgFlow Task Management System</p>
            <p style="margin: 5px 0 0 0;">© ${new Date().getFullYear()} OrgFlow. All rights reserved.</p>
          </div>
        </div>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Task completion email sent successfully:', info.messageId);
    return info;
  } catch (error) {
    console.error('❌ Task completion email error:', error.message);
    console.error('Error details:', error);
    throw error;
  }
};

module.exports = {
  sendTaskAssignmentEmail,
  sendTaskCompletionEmail
};