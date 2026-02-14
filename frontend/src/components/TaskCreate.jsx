import React, { useState, useEffect, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useTheme } from '../context/themeContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import useEmail from '../hooks/useEmail';

const TaskCreate = () => {
  const [employees, setEmployees] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [files, setFiles] = useState([]);
  const [uploadProgress, setUploadProgress] = useState({});
  const fileInputRef = useRef(null);
  const { theme } = useTheme();
  const { sendTaskAssignedEmail } = useEmail();

  const API_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await axios.get(`${API_URL}/user/employees`, {
          withCredentials: true
        });
        setEmployees(response.data.users);
      } catch (err) {
        console.error('Error fetching employees:', err);
      }
    }
    fetchEmployees();
  }, []);

  const generateShortId = () => uuidv4().substring(0, 5).toUpperCase();

  const [taskForm, setTaskForm] = useState({
    taskId: generateShortId(),
    title: '',
    description: '',
    assignedTo: '',
    dueDate: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTaskForm(prev => ({ ...prev, [name]: value }));
  };

  const handleFileSelect = (e) => {
    const selectedFiles = Array.from(e.target.files);
    
    // Check total files limit
    if (files.length + selectedFiles.length > 5) {
      toast.error('Maximum 5 files allowed per task');
      return;
    }

    // Check each file size (10MB limit)
    const oversizedFiles = selectedFiles.filter(file => file.size > 10 * 1024 * 1024);
    if (oversizedFiles.length > 0) {
      toast.error('File size should not exceed 10MB');
      return;
    }

    // Check file types
    const allowedTypes = [
      'image/jpeg', 'image/png', 'image/jpg',
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-powerpoint',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      'text/plain'
    ];

    const invalidFiles = selectedFiles.filter(file => !allowedTypes.includes(file.type));
    if (invalidFiles.length > 0) {
      toast.error('Invalid file type. Only images, PDFs, and Office documents are allowed.');
      return;
    }

    // Add files with preview data
    const newFiles = selectedFiles.map(file => ({
      file,
      id: Math.random().toString(36).substring(2, 9),
      name: file.name,
      size: file.size,
      type: file.type,
      progress: 0,
      status: 'pending'
    }));

    setFiles(prev => [...prev, ...newFiles]);
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeFile = (id) => {
    setFiles(prev => prev.filter(file => file.id !== id));
  };

  const getFileIcon = (type) => {
    if (type.includes('image')) return '🖼️';
    if (type.includes('pdf')) return '📄';
    if (type.includes('word') || type.includes('document')) return '📝';
    if (type.includes('excel') || type.includes('spreadsheet')) return '📊';
    if (type.includes('powerpoint') || type.includes('presentation')) return '📈';
    if (type.includes('text')) return '📃';
    return '📎';
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / 1048576).toFixed(1) + ' MB';
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  setIsSubmitting(true);

  // Validate required fields
  if (!taskForm.title || !taskForm.description || !taskForm.assignedTo || !taskForm.dueDate) {
    toast.error('Please fill all required fields');
    setIsSubmitting(false);
    return;
  }

  // Create FormData object with correct field names
  const formData = new FormData();
  formData.append('taskId', taskForm.taskId);
  formData.append('title', taskForm.title);
  formData.append('description', taskForm.description);
  formData.append('assignedTo', taskForm.assignedTo); // Keep as assignedTo
  formData.append('dueDate', taskForm.dueDate);       // Keep as dueDate

  // Append files if any
  files.forEach(file => {
    formData.append('files', file.file);
  });

  try {
    // Update files to uploading status
    setFiles(prev => prev.map(file => ({ ...file, status: 'uploading' })));

    // Create task with files
    const response = await axios.post(`${API_URL}/task/create`, formData, {
      withCredentials: true,
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      onUploadProgress: (progressEvent) => {
        const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        setUploadProgress({ overall: progress });
        
        // Update individual file progress
        setFiles(prev => prev.map(file => ({
          ...file,
          progress: progress
        })));
      }
    });

    toast.success('Task created successfully!');
    
    // Show attachment count if any
    if (files.length > 0 && response.data.task?.attachments?.length > 0) {
      toast.info(`${response.data.task.attachments.length} file(s) attached to the task`);
    }

    // Send email notification to assigned employee
    console.log('Looking for employee:', taskForm.assignedTo);
    console.log('Available employees:', employees);
    const assignedEmployee = employees.find(emp => emp.name === taskForm.assignedTo);
    console.log('Found employee:', assignedEmployee);
    
    if (assignedEmployee?.email) {
      console.log('Attempting to send email to:', assignedEmployee.email);
      sendTaskAssignedEmail(assignedEmployee.email, {
        taskId: response.data.task.taskId,
        title: response.data.task.title,
        description: response.data.task.description,
        dueDate: formatDate(response.data.task.dueDate),
        employeeName: assignedEmployee.name
      });
    } else {
      console.log('No email found for employee or employee not found');
    }

    // Reset form
    setTaskForm({
      taskId: generateShortId(),
      title: '',
      description: '',
      assignedTo: '',
      dueDate: ''
    });
    setFiles([]);
    setUploadProgress({});

  } catch (error) {
    console.error('Error creating task:', error);
    
    // Update files to error status
    setFiles(prev => prev.map(file => ({ ...file, status: 'error' })));
    
    // Show appropriate error message
    if (error.response?.data?.message) {
      if (error.response.data.details) {
        // Show validation errors
        const errorMessages = Object.values(error.response.data.details)
          .map(err => err.message || err.kind)
          .join(', ');
        toast.error(`Validation error: ${errorMessages}`);
      } else {
        toast.error(error.response.data.message);
      }
    } else if (error.response?.data?.error) {
      toast.error(error.response.data.error);
    } else {
      toast.error(error.response?.data?.msg || 'Failed to create task');
    }
  } finally {
    setIsSubmitting(false);
  }
};

  // Custom styles for theme
  const containerStyles = theme === 'dark' 
    ? 'bg-neutral-900/80 text-neutral-300 border-neutral-800' 
    : 'bg-neutral-100 text-neutral-900 border-neutral-300';
  
  const inputStyles = theme === 'dark' 
    ? 'bg-neutral-800 border-neutral-700 text-white focus:ring-emerald-700' 
    : 'bg-white border-neutral-300 text-neutral-900 focus:ring-emerald-500';
  
  const labelStyles = theme === 'dark' 
    ? 'text-neutral-300' 
    : 'text-neutral-900';
  
  const textColor = theme === 'dark' ? 'text-neutral-300' : 'text-neutral-900';
  const accentColor = theme === 'dark' ? 'text-emerald-400' : 'text-emerald-600';
  
  const filePreviewStyles = theme === 'dark'
    ? 'bg-neutral-800/50 border-neutral-700 hover:bg-neutral-800'
    : 'bg-white/50 border-neutral-300 hover:bg-white';
  
  const removeBtnStyles = theme === 'dark'
    ? 'text-red-400 hover:text-red-300 hover:bg-neutral-700'
    : 'text-red-500 hover:text-red-600 hover:bg-neutral-100';

  return (
    <div className={`${containerStyles} backdrop-blur-sm rounded-xl border py-6 px-4 sm:py-8 sm:px-6 md:px-12 lg:px-24 my-4 w-full sm:w-[90vw] md:w-[82vw] max-w-[1800px] mx-auto`}>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
        <h2 className={`text-xl sm:text-2xl font-semibold ${accentColor}`}>Create New Task</h2>
        <div className={`text-sm sm:text-md font-medium ${textColor}`}>
          Task ID: <span className={`font-mono ${accentColor} text-lg sm:text-xl`}>{taskForm.taskId}</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Task Title - Full width */}
          <div className="md:col-span-2">
            <label className={`block text-lg sm:text-md font-medium ${labelStyles} mb-2`}>
              Task Title <span className='text-red-500'>*</span>
            </label>
            <input
              type="text"
              name="title"
              value={taskForm.title}
              onChange={handleInputChange}
              required
              className={`w-full px-4 sm:px-5 py-2 sm:py-3 text-base sm:text-lg rounded-xl border focus:outline-none focus:ring-2 ${inputStyles}`}
              placeholder="Enter task title"
            />
          </div>

          {/* Assign To */}
          <div>
            <label className={`block text-lg sm:text-md font-medium ${labelStyles} mb-2`}>
              Assign To <span className='text-red-500'>*</span>
            </label>
            <select
              name="assignedTo"
              value={taskForm.assignedTo}
              onChange={handleInputChange}
              required
              className={`w-full px-4 sm:px-5 py-2 sm:py-3 text-base sm:text-lg rounded-xl border focus:outline-none focus:ring-2 ${inputStyles}`}
            >
              <option value="">Select Employee</option>
              {employees.map(emp => (
                <option key={emp.id} value={emp.name}>
                  {emp.name} ({emp.role})
                </option>
              ))}
            </select>
          </div>

          {/* Due Date */}
          <div>
            <label className={`block text-lg sm:text-md font-medium ${labelStyles} mb-2`}>
              Due Date <span className='text-red-500'>*</span>
            </label>
            <input
              type="date"
              name="dueDate"
              value={taskForm.dueDate}
              onChange={handleInputChange}
              required
              min={new Date().toISOString().split('T')[0]}
              className={`w-full px-4 sm:px-5 py-2 sm:py-3 text-base sm:text-lg rounded-xl border focus:outline-none focus:ring-2 ${inputStyles}`}
            />
          </div>
        </div>

        {/* Task Description */}
        <div>
          <label className={`block text-lg sm:text-md font-medium ${labelStyles} mb-2`}>
            Description <span className='text-red-500'>*</span>
          </label>
          <textarea
            name="description"
            value={taskForm.description}
            onChange={handleInputChange}
            required
            rows={5}
            className={`w-full px-4 sm:px-5 py-2 sm:py-3 text-base sm:text-lg rounded-xl border focus:outline-none focus:ring-2 ${inputStyles}`}
            placeholder="Describe the task details..."
          />
        </div>

        {/* File Upload Section */}
        <div>
          <label className={`block text-lg sm:text-md font-medium ${labelStyles} mb-2`}>
            Attach Files (Optional)
            <span className="text-sm font-normal ml-2 text-neutral-500">
              Max 5 files, 10MB each. Supported: Images, PDF, Word, Excel, PowerPoint, Text
            </span>
          </label>
          
          {/* File Upload Area */}
          <div 
            className={`border-2 border-dashed rounded-xl p-6 mb-4 transition-colors cursor-pointer hover:border-emerald-500 ${inputStyles} border-neutral-400/50`}
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileSelect}
              multiple
              accept=".jpg,.jpeg,.png,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,image/*,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.presentation,text/plain"
              className="hidden"
            />
            <div className="text-center">
              <div className="flex justify-center mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
                </svg>
              </div>
              <p className={`text-lg ${textColor} mb-1`}>
                Click to upload files
              </p>
              <p className="text-sm text-neutral-500">
                or drag and drop files here
              </p>
              <p className="text-xs text-neutral-500 mt-2">
                {files.length} of 5 files selected
              </p>
            </div>
          </div>

          {/* File Previews */}
          {files.length > 0 && (
            <div className="space-y-3 mb-4">
              <div className="flex items-center justify-between">
                <h3 className={`text-md font-medium ${labelStyles}`}>
                  Selected Files ({files.length}/5)
                </h3>
                {uploadProgress.overall > 0 && (
                  <div className={`text-sm ${textColor}`}>
                    Uploading: {uploadProgress.overall}%
                  </div>
                )}
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {files.map((file) => (
                  <div
                    key={file.id}
                    className={`flex items-center justify-between p-3 rounded-lg border ${filePreviewStyles} transition-colors`}
                  >
                    <div className="flex items-center space-x-3 min-w-0">
                      <span className="text-xl">
                        {getFileIcon(file.type)}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className={`font-medium truncate ${textColor}`}>
                          {file.name}
                        </p>
                        <p className="text-xs text-neutral-500">
                          {formatFileSize(file.size)}
                          {file.progress > 0 && file.progress < 100 && (
                            <span className="ml-2">• {file.progress}%</span>
                          )}
                          {file.status === 'error' && (
                            <span className="ml-2 text-red-500">• Failed</span>
                          )}
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeFile(file.id)}
                      className={`p-1 rounded-full transition-colors ${removeBtnStyles}`}
                      disabled={isSubmitting}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
              
              {/* Progress Bar */}
              {uploadProgress.overall > 0 && uploadProgress.overall < 100 && (
                <div className="w-full bg-neutral-200 dark:bg-neutral-700 rounded-full h-2 mt-3">
                  <div 
                    className="bg-emerald-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress.overall}%` }}
                  ></div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Submit Button */}
        <div className="pt-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`bg-emerald-700 hover:bg-emerald-600 text-white px-6 sm:px-8 py-3 sm:py-3.5 rounded-xl transition-colors font-medium flex items-center justify-center w-full text-base sm:text-lg ${
              isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
            }`}
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 sm:mr-3 h-5 w-5 sm:h-6 sm:w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {files.length > 0 ? 'Creating with Files...' : 'Creating...'}
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6 mr-2 sm:mr-3" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                </svg>
                Create Task {files.length > 0 ? `(${files.length} file${files.length > 1 ? 's' : ''})` : ''}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default TaskCreate;