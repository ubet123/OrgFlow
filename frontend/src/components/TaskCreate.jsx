import React, { useState, useEffect, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useTheme } from '../context/themeContext';
import axios from 'axios';
import toast from 'react-hot-toast';
import useEmail from '../hooks/useEmail';
import { FaFilePdf, FaFileImage, FaFileWord, FaFileExcel, FaFilePowerpoint, FaFileAlt, FaFile, FaUpload, FaSpinner, FaPlus } from 'react-icons/fa';

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
    const iconClass = "text-lg text-emerald-500 flex-shrink-0";
    if (type.includes('image')) return <FaFileImage className={iconClass} />;
    if (type.includes('pdf')) return <FaFilePdf className={iconClass} />;
    if (type.includes('word') || type.includes('document')) return <FaFileWord className={iconClass} />;
    if (type.includes('excel') || type.includes('spreadsheet')) return <FaFileExcel className={iconClass} />;
    if (type.includes('powerpoint') || type.includes('presentation')) return <FaFilePowerpoint className={iconClass} />;
    if (type.includes('text')) return <FaFileAlt className={iconClass} />;
    return <FaFile className={iconClass} />;
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
        toast.success(`${response.data.task.attachments.length} file(s) attached to the task`);
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
    ? 'glass-card-dark shadow-[0_4px_24px_rgba(0,0,0,0.2)]'
    : 'glass-card-light shadow-[0_2px_16px_rgba(0,0,0,0.03)]';

  const inputStyles = theme === 'dark'
    ? 'bg-neutral-900/50 border-neutral-800/50 text-white placeholder-neutral-600 focus:border-emerald-500/50 focus:ring-emerald-500/10'
    : 'bg-white/60 border-neutral-200/50 text-neutral-900 placeholder-neutral-400 focus:border-emerald-500/50 focus:ring-emerald-500/10';

  const labelStyles = theme === 'dark'
    ? 'text-neutral-500'
    : 'text-neutral-500';

  const textColor = theme === 'dark' ? 'text-neutral-200' : 'text-neutral-800';
  const accentColor = theme === 'dark' ? 'text-emerald-400' : 'text-emerald-600';

  const filePreviewStyles = theme === 'dark'
    ? 'bg-neutral-900/40 border-neutral-800/40 hover:bg-neutral-800/40'
    : 'bg-white/40 border-neutral-200/40 hover:bg-neutral-50/60';

  const removeBtnStyles = theme === 'dark'
    ? 'text-neutral-600 hover:text-red-400 hover:bg-neutral-800/60'
    : 'text-neutral-400 hover:text-red-500 hover:bg-neutral-100/60';

  return (
    <div className={`${containerStyles} rounded-2xl p-6 sm:p-8 max-w-[1400px] mx-auto w-full transition-all duration-300 animate-fade-in-up accent-top`}>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 pb-5 border-b border-neutral-500/10 gap-4">
        <h2 className={`text-xl sm:text-2xl font-bold tracking-tight ${accentColor}`}>Create New Task</h2>
        <div className={`text-sm font-medium ${theme === 'dark' ? 'text-neutral-400' : 'text-neutral-500'}`}>
          Task ID: <span className={`font-mono font-semibold px-2.5 py-1 rounded-lg ml-1.5 ${theme === 'dark' ? 'text-emerald-400 bg-emerald-500/10 border border-emerald-500/15' : 'text-emerald-600 bg-emerald-50/80 border border-emerald-200/40'}`}>{taskForm.taskId}</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Task Title - Full width */}
          <div className="md:col-span-2">
            <label className={`block text-[11px] font-semibold uppercase tracking-widest ${labelStyles} mb-2`}>
              Task Title <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              name="title"
              value={taskForm.title}
              onChange={handleInputChange}
              required
              className={`w-full px-4 py-3 text-sm rounded-xl border focus:outline-none focus:ring-4 transition-all duration-300 ${inputStyles}`}
              placeholder="Enter task title"
            />
          </div>

          {/* Assign To */}
          <div>
            <label className={`block text-[11px] font-semibold uppercase tracking-widest ${labelStyles} mb-2`}>
              Assign To <span className="text-red-400">*</span>
            </label>
            <select
              name="assignedTo"
              value={taskForm.assignedTo}
              onChange={handleInputChange}
              required
              className={`w-full px-4 py-3 text-sm rounded-xl border focus:outline-none focus:ring-4 transition-all duration-300 ${inputStyles}`}
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
            <label className={`block text-[11px] font-semibold uppercase tracking-widest ${labelStyles} mb-2`}>
              Due Date <span className="text-red-400">*</span>
            </label>
            <input
              type="date"
              name="dueDate"
              value={taskForm.dueDate}
              onChange={handleInputChange}
              required
              min={new Date().toISOString().split('T')[0]}
              className={`w-full px-4 py-3 text-sm rounded-xl border focus:outline-none focus:ring-4 transition-all duration-300 ${inputStyles}`}
            />
          </div>
        </div>

        {/* Task Description */}
        <div>
          <label className={`block text-[11px] font-semibold uppercase tracking-widest ${labelStyles} mb-2`}>
            Description <span className="text-red-400">*</span>
          </label>
          <textarea
            name="description"
            value={taskForm.description}
            onChange={handleInputChange}
            required
            rows={4}
            className={`w-full px-4 py-3 text-sm rounded-xl border focus:outline-none focus:ring-4 transition-all duration-300 resize-none ${inputStyles}`}
            placeholder="Describe the task details..."
          />
        </div>

        {/* File Upload Section */}
        <div>
          <label className={`block text-[11px] font-semibold uppercase tracking-widest ${labelStyles} mb-2 flex items-center justify-between flex-wrap gap-2`}>
            <span>Attach Files (Optional)</span>
            <span className="text-[10px] font-normal normal-case tracking-normal opacity-60">
              Max 5 files, 10MB each
            </span>
          </label>

          {/* File Upload Area */}
          <div
            className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-300 cursor-pointer group ${theme === 'dark'
                ? 'border-neutral-800/50 hover:border-emerald-500/40 hover:bg-emerald-500/[0.02]'
                : 'border-neutral-200/60 hover:border-emerald-500/40 hover:bg-emerald-50/20'
              }`}
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
            <div className="flex flex-col items-center justify-center">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-3 transition-all duration-300 ${theme === 'dark' ? 'bg-neutral-800/40 group-hover:bg-emerald-500/10' : 'bg-neutral-100/60 group-hover:bg-emerald-50'}`}>
                <FaUpload className={`h-5 w-5 transition-colors duration-300 ${theme === 'dark' ? 'text-neutral-600 group-hover:text-emerald-400' : 'text-neutral-400 group-hover:text-emerald-500'}`} />
              </div>
              <p className={`text-sm font-medium ${textColor} mb-0.5`}>
                Click to upload files
              </p>
              <p className={`text-xs ${theme === 'dark' ? 'text-neutral-600' : 'text-neutral-400'}`}>
                {files.length} of 5 selected
              </p>
            </div>
          </div>

          {/* File Previews */}
          {files.length > 0 && (
            <div className="space-y-3 mt-4">
              <div className="flex items-center justify-between pb-1">
                <h3 className={`text-[11px] font-semibold uppercase tracking-widest ${labelStyles}`}>
                  Selected Files ({files.length}/5)
                </h3>
                {uploadProgress.overall > 0 && (
                  <div className={`text-xs font-semibold text-emerald-500`}>
                    Uploading: {uploadProgress.overall}%
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {files.map((file) => (
                  <div
                    key={file.id}
                    className={`flex items-center justify-between p-3 rounded-xl border ${filePreviewStyles} transition-all duration-300`}
                  >
                    <div className="flex items-center space-x-3 min-w-0">
                      <div className={`p-1.5 rounded-lg flex-shrink-0 ${theme === 'dark' ? 'bg-emerald-500/10' : 'bg-emerald-50/80'}`}>
                        {getFileIcon(file.type)}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className={`text-sm font-medium truncate ${textColor}`}>
                          {file.name}
                        </p>
                        <p className={`text-xs flex items-center gap-1.5 mt-0.5 ${theme === 'dark' ? 'text-neutral-600' : 'text-neutral-400'}`}>
                          <span>{formatFileSize(file.size)}</span>
                          {file.progress > 0 && file.progress < 100 && (
                            <span>• {file.progress}%</span>
                          )}
                          {file.status === 'error' && (
                            <span className="text-red-500 font-medium">• Failed</span>
                          )}
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeFile(file.id)}
                      className={`p-1.5 rounded-lg transition-all duration-200 ${removeBtnStyles}`}
                      disabled={isSubmitting}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>

              {/* Progress Bar */}
              {uploadProgress.overall > 0 && uploadProgress.overall < 100 && (
                <div className={`w-full rounded-full h-1 mt-2 overflow-hidden ${theme === 'dark' ? 'bg-neutral-800/50' : 'bg-neutral-200/50'}`}>
                  <div
                    className="bg-emerald-500 h-full rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress.overall}%` }}
                  ></div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Submit Button */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white px-6 py-3 rounded-xl transition-all duration-300 font-semibold flex items-center justify-center w-full text-sm border border-emerald-500/20 hover:shadow-[0_0_20px_rgba(16,185,129,0.15)] active:scale-[0.99] ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
              }`}
          >
            {isSubmitting ? (
              <>
                <FaSpinner className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" />
                {files.length > 0 ? 'Creating with Files...' : 'Creating...'}
              </>
            ) : (
              <>
                <FaPlus className="h-3.5 w-3.5 mr-2" />
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