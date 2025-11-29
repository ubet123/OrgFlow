require('dotenv').config();
const emailjs = require('@emailjs/nodejs');

const emailjsConfig = {
  publicKey: process.env.EMAILJS_PUBLIC_KEY,
  privateKey: process.env.EMAILJS_PRIVATE_KEY,
};

// For task assignment emails
async function sendTaskAssignmentEmail(to, taskData) {
  try {
    console.log('Attempting to send task assignment email via EmailJS to:', to);
    
    const templateParams = {
      to_email: to,
      task_id: taskData.taskId,
      task_title: taskData.title,
      task_description: taskData.description,
      due_date: taskData.readableDate,
      from_name: 'OrgFlow',
      reply_to: 'dmelloserene08@gmail.com'
    };

    const result = await emailjs.send(
      process.env.EMAILJS_SERVICE_ID,
      process.env.EMAILJS_TASK_ASSIGNMENT_TEMPLATE_ID,
      templateParams,
      emailjsConfig
    );
    
    console.log('Task assignment email sent successfully via EmailJS:', result);
    return result;
  } catch (error) {
    console.error('EmailJS task assignment failed:', error);
    throw error;
  }
}

// For task completion emails
async function sendTaskCompletionEmail(to, taskData) {
  try {
    console.log('Attempting to send task completion email via EmailJS to:', to);
    
    const templateParams = {
      to_email: to,
      task_id: taskData.taskId,
      assigned_employee: taskData.assigned,
      completion_time: new Date().toLocaleString(),
      from_name: 'OrgFlow',
      reply_to: 'dmelloserene08@gmail.com'
    };

    const result = await emailjs.send(
      process.env.EMAILJS_SERVICE_ID,
      process.env.EMAILJS_TASK_COMPLETION_TEMPLATE_ID,
      templateParams,
      emailjsConfig
    );
    
    console.log('Task completion email sent successfully via EmailJS:', result);
    return result;
  } catch (error) {
    console.error('EmailJS task completion failed:', error);
    throw error;
  }
}

module.exports = {
  sendTaskAssignmentEmail,
  sendTaskCompletionEmail
};