import emailjs from '@emailjs/browser';

// Initialize EmailJS with public key
const initEmailJS = () => {
  const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;
  if (publicKey) {
    emailjs.init(publicKey);
  }
};

// Initialize on module load
initEmailJS();

const useEmail = () => {
  const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
  const taskAssignedTemplateId = import.meta.env.VITE_EMAILJS_TEMPLATE_TASK_ASSIGNED;
  const taskCompletedTemplateId = import.meta.env.VITE_EMAILJS_TEMPLATE_TASK_COMPLETED;

  /**
   * Send email notification when a task is assigned to an employee
   * @param {string} employeeEmail - The email address of the assigned employee
   * @param {Object} taskData - Task details
   * @param {string} taskData.taskId - Task ID
   * @param {string} taskData.title - Task title
   * @param {string} taskData.description - Task description
   * @param {string} taskData.dueDate - Task due date
   * @param {string} taskData.employeeName - Name of the assigned employee
   */
  const sendTaskAssignedEmail = async (employeeEmail, taskData) => {
    try {
      if (!serviceId || !taskAssignedTemplateId) {
        console.log('EmailJS service or template ID not configured');
        return;
      }

      const templateParams = {
        to_email: employeeEmail,
        employee_name: taskData.employeeName || 'Team Member',
        task_title: taskData.title,
        task_description: taskData.description || 'No description provided',
        due_date: taskData.dueDate || 'Not specified',
        task_id: taskData.taskId,
      };

      console.log('Sending task assigned email to:', employeeEmail);
      console.log('Template params:', templateParams);

      const response = await emailjs.send(
        serviceId,
        taskAssignedTemplateId,
        templateParams
      );

      console.log('Task assigned email sent successfully:', response.status);
    } catch (error) {
      console.log('Failed to send task assigned email:', error);
    }
  };

  /**
   * Send email notification when a task is marked as completed
   * @param {Object} taskData - Task details
   * @param {string} taskData.taskId - Task ID
   * @param {string} taskData.title - Task title
   * @param {string} taskData.employeeName - Name of the employee who completed the task
   * @param {string} taskData.completedDate - Date when task was completed
   */
  const sendTaskCompletedEmail = async (taskData) => {
    try {
      if (!serviceId || !taskCompletedTemplateId) {
        console.log('EmailJS service or template ID not configured');
        return;
      }

      const adminEmail = 'dmelloserene08@gmail.com';

      const templateParams = {
        to_email: adminEmail,
        assigned_employee: taskData.employeeName,
        completion_time: taskData.completedDate || new Date().toLocaleDateString(),
        task_title: taskData.title,
        task_id: taskData.taskId,
      };

      console.log('Sending task completed email with params:', templateParams);

      const response = await emailjs.send(
        serviceId,
        taskCompletedTemplateId,
        templateParams
      );

      console.log('Task completed email sent successfully:', response.status);
    } catch (error) {
      console.log('Failed to send task completed email:', error);
    }
  };

  return {
    sendTaskAssignedEmail,
    sendTaskCompletedEmail,
  };
};

export default useEmail;
