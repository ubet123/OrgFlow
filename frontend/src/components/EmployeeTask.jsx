import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useTheme } from '../context/themeContext';
import { CgAttachment } from "react-icons/cg";

const EmployeeTask = ({employee}) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pending, setPending] = useState([]);
  const [completed, setCompleted] = useState([]);
  const [completingTask, setCompletingTask] = useState(null);
  const [expandedTask, setExpandedTask] = useState(null);
  const [taskAttachments, setTaskAttachments] = useState({});
  const [loadingAttachments, setLoadingAttachments] = useState({});
  const { theme } = useTheme();

  const API_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';

  // Custom styles for theme
  const containerStyles = theme === 'dark' 
    ? 'bg-neutral-950 text-neutral-300' 
    : 'bg-neutral-50 text-neutral-800';
  
  const cardStyles = theme === 'dark' 
    ? 'bg-neutral-900/80 border-neutral-800' 
    : 'bg-white border-neutral-300';
  
  const textColor = theme === 'dark' ? 'text-neutral-300' : 'text-neutral-700';
  const textColorSecondary = theme === 'dark' ? 'text-neutral-400' : 'text-neutral-600';
  const textColorMuted = theme === 'dark' ? 'text-neutral-500' : 'text-neutral-500';
  const accentColor = theme === 'dark' ? 'text-emerald-400' : 'text-emerald-600';
  
  const overdueCardStyles = theme === 'dark' 
    ? 'border-red-500/50 bg-red-900/10' 
    : 'border-red-400/50 bg-red-100/50';
  
  const completedCardStyles = theme === 'dark' 
    ? 'border-emerald-500/30' 
    : 'border-emerald-400/30';

  // File icon mapping
  const getFileIcon = (fileType, mimetype) => {
    if (fileType === 'image') return '🖼️';
    if (fileType === 'pdf') return '📄';
    if (fileType === 'document') return '📝';
    if (fileType === 'spreadsheet') return '📊';
    if (fileType === 'presentation') return '📈';
    if (fileType === 'text') return '📃';
    if (mimetype.includes('image')) return '🖼️';
    if (mimetype.includes('pdf')) return '📄';
    return '📎';
  };

  // Format file size
  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / 1048576).toFixed(1) + ' MB';
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const isOverdue = (dueDate) => {
    if (!dueDate) return false;
    const due = new Date(dueDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return !isNaN(due.getTime()) && due < today;
  };

  useEffect(() => {
    if (tasks.length > 0) {
      const pendingTasks = tasks.filter((task) => task.status === 'Pending');
      const completedTasks = tasks.filter((task) => task.status === 'Completed');
      setPending(pendingTasks);
      setCompleted(completedTasks);
    }
  }, [tasks]);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_URL}/task/emptasks`, {
          withCredentials: true
        });

        if (response.data.success) {
          console.log('emp tasks on frontend', response.data.tasks);
          setTasks(response.data.tasks);
        } else {
          console.error(response.data.message);
        }
      } catch (error) {
        console.error('Error fetching tasks:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []); 

  // Fetch attachments for a task
  const fetchTaskAttachments = async (taskId) => {
    if (taskAttachments[taskId]) return; // Already loaded
    
    try {
      setLoadingAttachments(prev => ({ ...prev, [taskId]: true }));
      
      const response = await axios.get(
        `${API_URL}/attachment/employee/${taskId}/attachments`,
        { withCredentials: true }
      );

      if (response.data.success) {
        setTaskAttachments(prev => ({
          ...prev,
          [taskId]: response.data.attachments
        }));
      }
    } catch (error) {
      console.error('Error fetching attachments:', error);
      toast.error('Failed to load attachments');
    } finally {
      setLoadingAttachments(prev => ({ ...prev, [taskId]: false }));
    }
  };

  // Toggle task expansion
  const toggleTaskExpansion = (taskId) => {
    if (expandedTask === taskId) {
      setExpandedTask(null);
    } else {
      setExpandedTask(taskId);
      // Fetch attachments if not already loaded
      if (!taskAttachments[taskId]) {
        fetchTaskAttachments(taskId);
      }
    }
  };

  // Handle file download - Simple anchor tag approach
  const handleDownload = (fileUrl, filename) => {
    try {
      // Create a temporary anchor tag
      const link = document.createElement('a');
      link.href = fileUrl;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      
      // Add download attribute for non-image files
      if (!fileUrl.includes('/image/') && !fileUrl.includes('.jpg') && !fileUrl.includes('.png') && !fileUrl.includes('.jpeg') && !fileUrl.includes('.gif')) {
        link.download = filename || 'download';
      }
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error downloading file:', error);
      // Fallback to window.open
      window.open(fileUrl, '_blank', 'noopener,noreferrer');
    }
  };

  const handleMarkComplete = async (taskId) => {
    try {
      setCompletingTask(taskId);
      const response = await axios.patch(`${API_URL}/task/complete`, { taskId }, {
        withCredentials: true 
      });
      
      setTasks(tasks.map(task => 
        task.taskId === taskId ? { ...task, status: 'Completed' } : task
      ));

      toast.success(`${response.data.message}`, {
        position: "top-right",
        autoClose: 3000,
      });

    } catch (error) {
      console.error('Error marking task complete:', error);
    } finally {
      setCompletingTask(null);
    }
  };

  const formatDueDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return isNaN(date.getTime()) 
        ? 'No due date' 
        : date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
          });
    } catch {
      return 'Invalid date';
    }
  };

  if (loading) {
    return (
      <div className={`min-h-screen pt-12 px-4 pb-11 ${containerStyles}`}>
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-center py-20">
            <div className={`animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 ${theme === 'dark' ? 'border-emerald-500' : 'border-emerald-600'}`}></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen pt-12 px-4 pb-11 ${containerStyles}`}>
      <div className="max-w-7xl mx-auto">
        {tasks.length === 0 ? (
          <div className={`backdrop-blur-sm rounded-xl sm:rounded-2xl border-2 p-6 sm:p-8 md:p-12 text-center ${cardStyles}`}>
            <svg xmlns="http://www.w3.org/2000/svg" className={`h-16 sm:h-20 w-16 sm:w-20 mx-auto ${accentColor}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <h2 className={`text-xl sm:text-2xl font-semibold mt-4 sm:mt-6 ${textColor}`}>No Tasks Assigned</h2>
            <p className={`${textColorSecondary} mt-2 sm:mt-4 text-base sm:text-lg max-w-md mx-auto`}>
              You currently don't have any tasks assigned. Check back later or contact your manager if you believe this is an error.
            </p>
          </div>
        ) : (
          <>
            {/* Pending Tasks */}
            <div className="space-y-4 sm:space-y-6 md:space-y-8">
              {pending.length === 0 ? (
                <div className={`backdrop-blur-sm rounded-xl sm:rounded-2xl border-2 p-4 sm:p-6 md:p-8 text-center ${cardStyles}`}>
                  <svg xmlns="http://www.w3.org/2000/svg" className={`h-12 sm:h-16 w-12 sm:w-16 mx-auto mb-2 sm:mb-4 ${accentColor}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <h3 className={`text-xl sm:text-2xl font-semibold mb-1 sm:mb-2 ${accentColor}`}>All Caught Up!</h3>
                  <p className={`${textColorSecondary} text-base sm:text-lg`}>No pending tasks as of now. Enjoy your free time!</p>
                </div>
              ) : (
                <>
                  <h1 className={`text-2xl sm:text-3xl md:text-4xl font-bold mb-6 sm:mb-8 md:mb-10 ${accentColor}`}>
                    Your Pending Tasks ({pending.length})
                  </h1>
                  {pending.sort((a, b) => new Date(a.due) - new Date(b.due)).map((task) => {
                    const overdue = isOverdue(task.due);
                    const attachments = taskAttachments[task.taskId] || [];
                    const isLoading = loadingAttachments[task.taskId];
                    const isExpanded = expandedTask === task.taskId;
                    
                    return (
                      <div 
                        key={task.taskId}
                        className={`backdrop-blur-sm rounded-xl sm:rounded-2xl border-2 p-4 sm:p-6 md:p-8 w-full transition-all hover:border-emerald-500/30 ${
                          overdue ? overdueCardStyles : cardStyles
                        }`}
                      >
                        <div className="flex flex-col lg:flex-row justify-between items-start gap-4 lg:gap-6">
                          <div className="flex-1 w-full">
                            <div className="flex flex-wrap items-center gap-2 sm:gap-4 mb-3 sm:mb-4">
                              <span className={`font-mono text-sm sm:text-base md:text-lg ${accentColor} ${theme === 'dark' ? 'bg-emerald-900/20' : 'bg-emerald-100'} px-3 py-1 sm:px-4 sm:py-1.5 rounded-full`}>
                                {task.taskId}
                              </span>
                              <span className={`text-xs sm:text-sm font-medium px-2 py-1 sm:px-3 sm:py-1.5 rounded-full ${
                                overdue 
                                  ? (theme === 'dark' ? 'bg-red-900/50 text-red-300' : 'bg-red-200 text-red-800') 
                                  : (theme === 'dark' ? 'bg-amber-900/50 text-amber-300' : 'bg-amber-200 text-amber-800')
                              }`}>
                                {task.status}
                              </span>
                              {overdue && (
                                <span className={`animate-pulse text-xs sm:text-sm font-medium px-2 py-1 sm:px-3 sm:py-1.5 rounded-full ${
                                  theme === 'dark' ? 'bg-red-900/50 text-red-300' : 'bg-red-200 text-red-800'
                                }`}>
                                  Past Due!
                                </span>
                              )}
                              {/* Attachment indicator */}
                              {task.hasAttachments && (
                                <button
                                  onClick={() => toggleTaskExpansion(task.taskId)}
                                  className={`text-xs sm:text-sm font-medium px-2 py-1 sm:px-3 sm:py-1.5 rounded-full flex items-center gap-1 ${
                                    theme === 'dark' 
                                      ? 'bg-blue-900/50 text-blue-300 hover:bg-blue-800/50' 
                                      : 'bg-blue-200 text-blue-800 hover:bg-blue-300'
                                  }`}
                                >
                                  <span><CgAttachment className="h-3 w-3 sm:h-4 sm:w-4" /></span>
                                  <span>{task.attachmentCount} file{task.attachmentCount !== 1 ? 's' : ''}</span>
                                  <svg 
                                    xmlns="http://www.w3.org/2000/svg" 
                                    className={`h-3 w-3 sm:h-4 sm:w-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} 
                                    viewBox="0 0 20 20" 
                                    fill="currentColor"
                                  >
                                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                  </svg>
                                </button>
                              )}
                            </div>
                            <h2 className={`text-xl sm:text-2xl font-semibold mb-2 sm:mb-4 ${
                              overdue ? (theme === 'dark' ? 'text-red-300' : 'text-red-700') : textColor
                            }`}>
                              {task.title}
                            </h2>
                            <p className={`text-base sm:text-lg mb-4 sm:mb-6 leading-relaxed ${
                              overdue ? (theme === 'dark' ? 'text-red-200/80' : 'text-red-600/80') : textColorSecondary
                            }`}>
                              {task.description}
                            </p>

                            {/* Attachments Section */}
                            {isExpanded && task.hasAttachments && (
                              <div className="mt-6 mb-6">
                                <h3 className={`text-lg font-semibold mb-4 ${textColor} flex items-center gap-2`}>
                                  <span><CgAttachment className="h-3 w-3 sm:h-4 sm:w-4" /></span>
                                  <span>Attachments ({attachments.length})</span>
                                </h3>
                                
                                {isLoading ? (
                                  <div className="flex items-center justify-center py-4">
                                    <div className={`animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 ${theme === 'dark' ? 'border-emerald-500' : 'border-emerald-600'}`}></div>
                                    <span className="ml-3 text-neutral-500">Loading files...</span>
                                  </div>
                                ) : attachments.length === 0 ? (
                                  <div className={`text-center py-6 rounded-lg ${theme === 'dark' ? 'bg-neutral-800/50' : 'bg-neutral-100'}`}>
                                    <p className={textColorSecondary}>No files attached to this task</p>
                                  </div>
                                ) : (
                                  <div className="space-y-3">
                                    {attachments.map((file, index) => (
                                      <div 
                                        key={index}
                                        className={`flex flex-col xs:flex-row items-start sm:max-w-[700px] xs:items-center justify-between p-3 rounded-lg ${theme === 'dark' ? 'bg-neutral-800/50 hover:bg-neutral-800' : 'bg-neutral-100 hover:bg-neutral-200'} transition-colors gap-3 xs:gap-4`}
                                      >
                                        <div className="flex items-center gap-3 flex-1 min-w-0 w-full sm:w-auto">
                                          <span className="text-xl flex-shrink-0">
                                            {getFileIcon(file.fileType, file.mimetype)}
                                          </span>
                                          <div className="min-w-0 flex-1">
                                            <p className={`font-medium ${textColor} truncate`}>{file.filename}</p>
                                            <div className="flex flex-wrap items-center gap-2 text-xs text-neutral-500 mt-1">
                                              <span>{formatFileSize(file.size)}</span>
                                              <span>•</span>
                                              <span className="capitalize">{file.fileType}</span>
                                              {file.uploadedAt && (
                                                <>
                                                  <span>•</span>
                                                  <span className="hidden xs:inline">Added {formatDate(file.uploadedAt)}</span>
                                                  <span className="xs:hidden">{formatDate(file.uploadedAt)}</span>
                                                </>
                                              )}
                                            </div>
                                          </div>
                                        </div>
                                        <button
                                          onClick={() => handleDownload(file.url, file.filename)}
                                          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap w-full sm:w-44 mt-2 xs:mt-0 flex-shrink-0 ${
                                            theme === 'dark' 
                                              ? 'bg-emerald-800 hover:bg-emerald-700 text-emerald-100' 
                                              : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                                          }`}
                                        >
                                          Download
                                        </button>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            )}

                            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-6">
                              <button
                                onClick={() => handleMarkComplete(task.taskId)}
                                disabled={completingTask === task.taskId}
                                className={`${
                                  overdue
                                    ? 'bg-red-700 hover:bg-red-600'
                                    : 'bg-emerald-700 hover:bg-emerald-600'
                                } text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg transition-colors font-medium flex items-center justify-center text-base sm:text-lg w-full sm:w-80 disabled:opacity-50 disabled:cursor-not-allowed`}
                              >
                                {completingTask === task.taskId ? (
                                  <>
                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 sm:h-5 sm:w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    <span className="truncate">Completing...</span>
                                  </>
                                ) : (
                                  <>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6 mr-2 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                    <span className="truncate">Mark Complete</span>
                                  </>
                                )}
                              </button>
                            </div>
                          </div>
                          
                          <div className="flex flex-col items-start lg:items-end w-full lg:w-auto lg:min-w-[180px] mt-4 lg:mt-0">
                            <div className="text-left lg:text-right w-full">
                              <p className={`text-xs sm:text-sm ${textColorMuted} mb-1`}>Due Date</p>
                              <p className={`text-base sm:text-lg font-medium ${
                                overdue ? (theme === 'dark' ? 'text-red-300' : 'text-red-700') : textColor
                              }`}>
                                {formatDueDate(task.due)}
                                {overdue && (
                                  <span className={`block text-xs mt-1 ${theme === 'dark' ? 'text-red-400' : 'text-red-600'}`}>
                                    (Was due {formatDueDate(task.due)})
                                  </span>
                                )}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </>
              )}
            </div>

            {/* Completed Tasks */}
            {completed.length === 0 ? (
              <div className={`backdrop-blur-sm rounded-xl sm:rounded-2xl border-2 p-4 sm:p-6 md:p-8 text-center mt-8 sm:mt-10 md:mt-14 ${cardStyles}`}>
                <svg xmlns="http://www.w3.org/2000/svg" className={`h-12 sm:h-16 w-12 sm:w-16 mx-auto mb-2 sm:mb-4 ${theme === 'dark' ? 'text-amber-400' : 'text-amber-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className={`text-xl sm:text-2xl font-semibold mb-1 sm:mb-2 ${theme === 'dark' ? 'text-amber-300' : 'text-amber-600'}`}>Work In Progress</h3>
                <p className={`${textColorSecondary} text-base sm:text-lg`}>No tasks completed yet. Keep going!</p>
                <div className={`mt-4 sm:mt-6 text-xs sm:text-sm ${textColorMuted} flex items-center justify-center`}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-1.5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z" clipRule="evenodd" />
                  </svg>
                  <span>Complete tasks to see them listed here</span>
                </div>
              </div>
            ) : (
              <>
                <h1 className={`text-2xl sm:text-3xl md:text-4xl font-bold mb-6 sm:mb-8 md:mb-10 mt-8 sm:mt-10 md:mt-11 ${accentColor}`}>
                  Your Completed Tasks ({completed.length})
                </h1>
                <div className="space-y-4 sm:space-y-6 md:space-y-8">
                  {completed
                    .sort((a, b) => new Date(a.due) - new Date(b.due))
                    .map((task) => {
                      const attachments = taskAttachments[task.taskId] || [];
                      const isLoading = loadingAttachments[task.taskId];
                      const isExpanded = expandedTask === task.taskId;
                      
                      return (
                        <div 
                          key={task.taskId}
                          className={`backdrop-blur-sm rounded-xl sm:rounded-2xl border-2 p-4 sm:p-6 md:p-8 w-full transition-all hover:border-emerald-500/30 ${cardStyles} ${completedCardStyles}`}
                        >
                          <div className="flex flex-col lg:flex-row justify-between items-start gap-4 lg:gap-6">
                            <div className="flex-1 w-full">
                              <div className="flex flex-wrap items-center gap-2 sm:gap-4 mb-3 sm:mb-4">
                                <span className={`font-mono text-sm sm:text-base md:text-lg ${accentColor} ${theme === 'dark' ? 'bg-emerald-900/20' : 'bg-emerald-100'} px-3 py-1 sm:px-4 sm:py-1.5 rounded-full`}>
                                  {task.taskId}
                                </span>
                                <span className={`text-xs sm:text-sm font-medium px-2 py-1 sm:px-3 sm:py-1.5 rounded-full ${
                                  theme === 'dark' ? 'bg-emerald-900/50 text-emerald-300' : 'bg-emerald-200 text-emerald-800'
                                }`}>
                                  {task.status}
                                </span>
                                {/* Attachment indicator for completed tasks */}
                                {task.hasAttachments && (
                                  <button
                                    onClick={() => toggleTaskExpansion(task.taskId)}
                                    className={`text-xs sm:text-sm font-medium px-2 py-1 sm:px-3 sm:py-1.5 rounded-full flex items-center gap-1 ${
                                      theme === 'dark' 
                                        ? 'bg-blue-900/50 text-blue-300 hover:bg-blue-800/50' 
                                        : 'bg-blue-200 text-blue-800 hover:bg-blue-300'
                                    }`}
                                  >
                                    <span><CgAttachment className="h-3 w-3 sm:h-4 sm:w-4" /></span>
                                    <span>{task.attachmentCount} file{task.attachmentCount !== 1 ? 's' : ''}</span>
                                    <svg 
                                      xmlns="http://www.w3.org/2000/svg" 
                                      className={`h-3 w-3 sm:h-4 sm:w-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} 
                                      viewBox="0 0 20 20" 
                                      fill="currentColor"
                                    >
                                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                    </svg>
                                  </button>
                                )}
                              </div>
                              <h2 className={`text-xl sm:text-2xl font-semibold mb-2 sm:mb-4 ${textColor}`}>{task.title}</h2>
                              <p className={`${textColorSecondary} text-base sm:text-lg mb-4 sm:mb-6 leading-relaxed`}>{task.description}</p>

                              {/* Attachments Section for Completed Tasks */}
                              {isExpanded && task.hasAttachments && (
                                <div className="mt-6 mb-6">
                                  <h3 className={`text-lg font-semibold mb-4 ${textColor} flex items-center gap-2`}>
                                    <span><CgAttachment className="h-3 w-3 sm:h-4 sm:w-4" /></span>
                                    <span>Attachments ({attachments.length})</span>
                                  </h3>
                                  
                                  {isLoading ? (
                                    <div className="flex items-center justify-center py-4">
                                      <div className={`animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 ${theme === 'dark' ? 'border-emerald-500' : 'border-emerald-600'}`}></div>
                                      <span className="ml-3 text-neutral-500">Loading files...</span>
                                    </div>
                                  ) : attachments.length === 0 ? (
                                    <div className={`text-center py-6 rounded-lg ${theme === 'dark' ? 'bg-neutral-800/50' : 'bg-neutral-100'}`}>
                                      <p className={textColorSecondary}>No files attached to this task</p>
                                    </div>
                                  ) : (
                                    <div className="space-y-3">
                                      {attachments.map((file, index) => (
                                        <div 
                                          key={index}
                                          className={`flex flex-col xs:flex-row items-start sm:max-w-[700px] xs:items-center justify-between p-3 rounded-lg ${theme === 'dark' ? 'bg-neutral-800/50 hover:bg-neutral-800' : 'bg-neutral-100 hover:bg-neutral-200'} transition-colors gap-3 xs:gap-4`}
                                        >
                                          <div className="flex items-center gap-3 flex-1 min-w-0 w-full xs:w-auto">
                                            <span className="text-xl flex-shrink-0">
                                              {getFileIcon(file.fileType, file.mimetype)}
                                            </span>
                                            <div className="min-w-0 flex-1">
                                              <p className={`font-medium ${textColor} truncate`}>{file.filename}</p>
                                              <div className="flex flex-wrap items-center gap-2 text-xs text-neutral-500 mt-1">
                                                <span>{formatFileSize(file.size)}</span>
                                                <span>•</span>
                                                <span className="capitalize">{file.fileType}</span>
                                                {file.uploadedAt && (
                                                  <>
                                                    <span>•</span>
                                                    <span className="hidden xs:inline">Added {formatDate(file.uploadedAt)}</span>
                                                    <span className="xs:hidden">{formatDate(file.uploadedAt)}</span>
                                                  </>
                                                )}
                                              </div>
                                            </div>
                                          </div>
                                          <button
                                            onClick={() => handleDownload(file.url, file.filename)}
                                            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap w-full xs:w-auto sm:w-44 mt-2 xs:mt-0 flex-shrink-0 ${
                                              theme === 'dark' 
                                                ? 'bg-emerald-800 hover:bg-emerald-700 text-emerald-100' 
                                                : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                                            }`}
                                          >
                                            Download
                                          </button>
                                        </div>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              )}

                              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-6">
                                <button
                                  disabled
                                  className={`${theme === 'dark' ? 'bg-emerald-900 text-emerald-300' : 'bg-emerald-100 text-emerald-800'} px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-medium flex items-center justify-center text-base sm:text-lg w-full sm:w-80 cursor-not-allowed opacity-70`}
                                >
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6 mr-2 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                  </svg>
                                  <span className="truncate">Task Completed</span>
                                </button>
                              </div>
                            </div>
                            
                            <div className="flex flex-col items-start lg:items-end w-full lg:w-auto lg:min-w-[180px] mt-4 lg:mt-0">
                              <div className="text-left lg:text-right w-full">
                                <p className={`text-xs sm:text-sm ${textColorMuted} mb-1`}>Due Date</p>
                                <p className={`text-base sm:text-lg font-medium ${textColor}`}>
                                  {formatDueDate(task.due)}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default EmployeeTask;