import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { IoIosArrowBack } from "react-icons/io";
import { useTheme } from '../context/themeContext';
import { CgAttachment } from "react-icons/cg";

const AdminEmpTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pending, setPending] = useState([]);
  const [completed, setCompleted] = useState([]);
  const [taskAttachments, setTaskAttachments] = useState({});
  const [loadingAttachments, setLoadingAttachments] = useState({});
  const [expandedTask, setExpandedTask] = useState(null);

  const API_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';
  const { id } = useParams();
  const employeeName = id ? decodeURIComponent(id) : '';
  const navigate = useNavigate();
  const { theme } = useTheme();

  // File icon mapping
  const getFileIcon = (fileType, mimetype) => {
    if (fileType === 'image') return '🖼️';
    if (fileType === 'pdf') return '📄';
    if (fileType === 'document') return '📝';
    if (fileType === 'spreadsheet') return '📊';
    if (fileType === 'presentation') return '📈';
    if (fileType === 'text') return '📃';
    if (mimetype && mimetype.includes('image')) return '🖼️';
    if (mimetype && mimetype.includes('pdf')) return '📄';
    return '📎';
  };

  // Format file size
  const formatFileSize = (bytes) => {
    if (!bytes || bytes < 1024) return bytes + ' B';
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

  const getFileTypeFromMime = (mimetype) => {
    if (!mimetype) return 'other';
    if (mimetype.startsWith('image/')) return 'image';
    if (mimetype === 'application/pdf') return 'pdf';
    if (mimetype.includes('word') || mimetype.includes('document')) return 'document';
    if (mimetype.includes('excel') || mimetype.includes('spreadsheet')) return 'spreadsheet';
    if (mimetype.includes('powerpoint') || mimetype.includes('presentation')) return 'presentation';
    if (mimetype.startsWith('text/')) return 'text';
    return 'other';
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
      setPending(tasks.filter((t) => t.status === 'Pending'));
      setCompleted(tasks.filter((t) => t.status === 'Completed'));
    }
  }, [tasks]);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get(`${API_URL}/task/adminemptasks`, {
          params: { employee: employeeName },
          withCredentials: true  
        });
        
        // Check if tasks have attachments info, if not add it
        const tasksWithAttachmentInfo = response.data.tasks.map(task => ({
          ...task,
          hasAttachments: task.attachments && task.attachments.length > 0,
          attachmentCount: task.attachments ? task.attachments.length : 0
        }));
        
        setTasks(tasksWithAttachmentInfo);
      } catch (error) {
        console.error('Error fetching tasks:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchTasks();
  }, [employeeName]);

  // Fetch attachments for a task (admin endpoint)
  const fetchTaskAttachments = async (taskId) => {
    if (taskAttachments[taskId]) return; // Already loaded
    
    try {
      setLoadingAttachments(prev => ({ ...prev, [taskId]: true }));
      
      const response = await axios.get(
        `${API_URL}/attachment/${taskId}/attachments`,
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
      // Try alternative endpoint
      try {
        const taskResponse = await axios.get(
          `${API_URL}/task/${taskId}/attachments`,
          { withCredentials: true }
        );
        
        if (taskResponse.data.success) {
          setTaskAttachments(prev => ({
            ...prev,
            [taskId]: taskResponse.data.attachments
          }));
        }
      } catch (secondError) {
        console.error('Both attachment endpoints failed:', secondError);
      }
    } finally {
      setLoadingAttachments(prev => ({ ...prev, [taskId]: false }));
    }
  };

  // Check if task has attachments from task data
  const checkTaskHasAttachments = (task) => {
    // First check if task.attachments array exists and has items
    if (task.attachments && Array.isArray(task.attachments) && task.attachments.length > 0) {
      return true;
    }
    // Then check if hasAttachments property exists
    if (task.hasAttachments) {
      return true;
    }
    // Finally check if we've already fetched attachments for this task
    if (taskAttachments[task.taskId] && taskAttachments[task.taskId].length > 0) {
      return true;
    }
    return false;
  };

  // Get attachment count for a task
  const getAttachmentCount = (task) => {
    // First check if task.attachments array exists
    if (task.attachments && Array.isArray(task.attachments)) {
      return task.attachments.length;
    }
    // Then check if we have fetched attachments
    if (taskAttachments[task.taskId]) {
      return taskAttachments[task.taskId].length;
    }
    // Finally check attachmentCount property
    return task.attachmentCount || 0;
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

  const formatDueDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return isNaN(date.getTime())
        ? 'No due date'
        : date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    } catch {
      return 'Invalid date';
    }
  };

  // Custom styles for theme
  const pageBg = theme === 'dark' ? 'bg-neutral-950 text-neutral-300' : 'bg-gray-50 text-gray-800';
  const cardBg = theme === 'dark' ? 'bg-neutral-900/80 border-neutral-800' : 'bg-white border-gray-200';
  const sectionTitle = theme === 'dark' ? 'text-emerald-400' : 'text-emerald-600';
  const headingText = theme === 'dark' ? 'text-white' : 'text-gray-900';
  const subText = theme === 'dark' ? 'text-neutral-400' : 'text-gray-600';
  const accentText = theme === 'dark' ? 'text-emerald-300' : 'text-emerald-700';
  const dividerBg = theme === 'dark' ? 'bg-white/20' : 'bg-black/20';
  
  const overdueCardStyles = theme === 'dark' 
    ? 'bg-red-900/30 border-red-700 text-white' 
    : 'bg-red-100/80 border-red-400 text-red-900';
  
  const statusBadgePending = theme === 'dark' 
    ? 'bg-amber-600 text-white' 
    : 'bg-amber-500 text-white';
  
  const statusBadgeCompleted = theme === 'dark' 
    ? 'bg-emerald-600 text-white' 
    : 'bg-emerald-500 text-white';
  
  const taskIdBadge = theme === 'dark' 
    ? 'bg-emerald-700 text-emerald-100' 
    : 'bg-emerald-600 text-white';
  
  const backButtonStyles = theme === 'dark' 
    ? 'text-emerald-400 bg-neutral-900/70 border border-emerald-400/20 hover:bg-neutral-800' 
    : 'text-emerald-700 bg-white border border-emerald-200 hover:bg-gray-100';
  
  const attachmentButtonStyles = theme === 'dark' 
    ? 'bg-blue-900/50 text-blue-300 hover:bg-blue-800/50' 
    : 'bg-blue-200 text-blue-800 hover:bg-blue-300';
  
  const attachmentCardStyles = theme === 'dark' 
    ? 'bg-neutral-800/50 hover:bg-neutral-800' 
    : 'bg-neutral-100 hover:bg-neutral-200';
  
  const downloadButtonStyles = theme === 'dark' 
    ? 'bg-emerald-800 hover:bg-emerald-700 text-emerald-100' 
    : 'bg-emerald-600 hover:bg-emerald-700 text-white';

  if (loading) {
    return (
      <div className={`min-h-screen ${pageBg} flex items-center justify-center`}>
        <div className={`animate-spin rounded-full h-14 w-14 border-t-2 border-b-2 ${theme === 'dark' ? 'border-emerald-400' : 'border-emerald-600'}`}></div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${pageBg} pt-14 px-4 sm:px-6 pb-14`}>
      {/* Header - Made Responsive */}
      <div className="mb-8 sm:mb-10 max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 sm:gap-6">
          {/* Employee Name and Title */}
          <div className="flex flex-col sm:flex-row sm:items-end gap-2 sm:gap-3">
            <h1 className={`font-extrabold text-2xl sm:text-3xl lg:text-4xl xl:text-5xl ${headingText} break-words`}>
              {employeeName || 'Employee'}
            </h1>
            <span className={`${accentText} font-bold text-xl sm:text-2xl lg:text-3xl xl:text-4xl sm:mb-1`}>
              's Tasks
            </span>
          </div>
          
          {/* Back Button */}
          <button
            onClick={() => navigate('/manager-dashboard')}
            className={`flex items-center justify-center gap-2 px-4 py-2.5 sm:px-5 sm:py-3 rounded-xl transition-all text-base sm:text-lg w-full sm:w-auto ${backButtonStyles}`}
          >
            <IoIosArrowBack className="text-lg sm:text-xl" />
            <span>Back to Dashboard</span>
          </button>
        </div>
      </div>

      {/* Divider */}
      <div className="relative mt-2 mb-12 sm:mb-20 max-w-7xl mx-auto">
        <div className={`absolute bottom-0 left-0 w-full h-px ${dividerBg}`}></div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto space-y-12 sm:space-y-14">
        {tasks.length === 0 ? (
          <div className={`${cardBg} backdrop-blur-sm rounded-2xl border p-8 sm:p-10 text-center`}>
            <svg xmlns="http://www.w3.org/2000/svg" className={`h-16 w-16 sm:h-20 sm:w-20 mx-auto ${theme === 'dark' ? 'text-emerald-500' : 'text-emerald-600'} mb-4 sm:mb-6`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <h2 className={`text-2xl sm:text-3xl font-semibold ${headingText} mb-2`}>No Tasks Assigned</h2>
            <p className={subText}>This employee doesn't have any tasks yet.</p>
          </div>
        ) : (
          <>
            {/* Pending Tasks Section */}
            <div>
              {pending.length === 0 ? (
                <div className={`${cardBg} rounded-2xl border p-6 sm:p-8 text-center`}>
                  <h3 className={`text-xl sm:text-2xl font-semibold ${sectionTitle} mb-2`}>All Caught Up!</h3>
                  <p className={subText}>No pending tasks right now.</p>
                </div>
              ) : (
                <>
                  <h2 className={`text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 ${sectionTitle}`}>Pending Tasks ({pending.length})</h2>
                  <div className="space-y-6 sm:space-y-8">
                    {pending.sort((a, b) => new Date(a.due) - new Date(b.due)).map((task) => {
                      const overdue = isOverdue(task.due);
                      const attachments = taskAttachments[task.taskId] || [];
                      const isLoading = loadingAttachments[task.taskId];
                      const isExpanded = expandedTask === task.taskId;
                      const hasAttachments = checkTaskHasAttachments(task);
                      const attachmentCount = getAttachmentCount(task);
                      
                      return (
                        <div
                          key={task.taskId}
                          className={`rounded-2xl border p-6 sm:p-8 transition-all ${
                            overdue
                              ? overdueCardStyles
                              : `${cardBg} hover:border-emerald-400/40`
                          }`}
                        >
                          <div className="flex flex-col lg:flex-row justify-between gap-4 sm:gap-6">
                            <div className="flex-1">
                              <div className="flex gap-2 sm:gap-3 mb-3 sm:mb-4 flex-wrap">
                                <span className={`font-mono text-xs sm:text-sm px-2 sm:px-3 py-1 rounded-full ${taskIdBadge}`}>
                                  {task.taskId}
                                </span>
                                <span className={`text-xs px-2 sm:px-3 py-1 rounded-full ${
                                  overdue
                                    ? 'bg-red-700 text-white'
                                    : statusBadgePending
                                }`}>
                                  {task.status}
                                </span>
                                {overdue && (
                                  <span className="animate-pulse text-xs px-2 sm:px-3 py-1 rounded-full bg-red-600 text-white">
                                    Past Due!
                                  </span>
                                )}
                                {/* Attachment indicator */}
                                {hasAttachments && (
                                  <button
                                    onClick={() => toggleTaskExpansion(task.taskId)}
                                    className={`text-xs sm:text-sm font-medium px-2 sm:px-3 py-1 rounded-full flex items-center gap-1 ${attachmentButtonStyles}`}
                                  >
                                    <span><CgAttachment className="h-3 w-3 sm:h-4 sm:w-4" /></span>
                                    <span>{attachmentCount} file{attachmentCount !== 1 ? 's' : ''}</span>
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
                              <h3 className={`text-xl sm:text-2xl font-semibold ${overdue ? (theme === 'dark' ? 'text-white' : 'text-red-900') : headingText}`}>
                                {task.title}
                              </h3>
                              <p className={`${overdue ? (theme === 'dark' ? 'text-red-100' : 'text-red-800') : subText} mt-3 sm:mt-5 text-sm sm:text-base`}>
                                {task.description}
                              </p>

                              {/* Attachments Section */}
                              {isExpanded && hasAttachments && (
                                <div className="mt-6 mb-6">
                                  <h3 className={`text-lg font-semibold mb-4 ${headingText} flex items-center gap-2`}>
                                    <span><CgAttachment className="h-3 w-3 sm:h-4 sm:w-4" /></span>
                                    <span>Attachments ({attachmentCount})</span>
                                  </h3>
                                  
                                  {isLoading ? (
                                    <div className="flex items-center justify-center py-4">
                                      <div className={`animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 ${theme === 'dark' ? 'border-emerald-500' : 'border-emerald-600'}`}></div>
                                      <span className={`ml-3 ${subText}`}>Loading files...</span>
                                    </div>
                                  ) : attachments.length === 0 ? (
                                    <div className={`text-center py-6 rounded-lg ${theme === 'dark' ? 'bg-neutral-800/50' : 'bg-neutral-100'}`}>
                                      <p className={subText}>No files attached to this task</p>
                                    </div>
                                  ) : (
                                    <div className="space-y-3">
                                      {attachments.map((file, index) => {
                                        const fileType = file.fileType || getFileTypeFromMime(file.mimetype);
                                        const fileMime = file.mimetype || '';
                                        
                                        return (
                                          <div 
                                            key={index}
                                            className={`flex flex-col xs:flex-row items-start sm:max-w-[700px] xs:items-center justify-between p-3 rounded-lg ${attachmentCardStyles} transition-colors gap-3 xs:gap-4`}
                                          >
                                            <div className="flex items-center gap-3 flex-1 min-w-0 w-full sm:w-auto">
                                              <span className="text-xl flex-shrink-0">
                                                {getFileIcon(fileType, fileMime)}
                                              </span>
                                              <div className="min-w-0 flex-1">
                                                <p className={`font-medium ${headingText} truncate`}>{file.filename}</p>
                                                <div className="flex flex-wrap items-center gap-2 text-xs text-neutral-500 mt-1">
                                                  <span>{formatFileSize(file.size)}</span>
                                                  <span>•</span>
                                                  <span className="capitalize">{fileType}</span>
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
                                              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap w-full sm:w-44 mt-2 xs:mt-0 flex-shrink-0 ${downloadButtonStyles}`}
                                            >
                                              Download
                                            </button>
                                          </div>
                                        );
                                      })}
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                            <div className="text-left lg:text-right min-w-[120px]">
                              <p className={`${overdue ? (theme === 'dark' ? 'text-red-200' : 'text-red-700') : subText} text-xs sm:text-sm`}>
                                Due Date
                              </p>
                              <p className={`${overdue ? (theme === 'dark' ? 'text-white' : 'text-red-900') : headingText} font-medium text-base sm:text-lg`}>
                                {formatDueDate(task.due)}
                              </p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </>
              )}
            </div>

            {/* Completed Tasks Section */}
            <div>
              {completed.length === 0 ? (
                <div className={`${cardBg} rounded-2xl border p-6 sm:p-8 text-center`}>
                  <h3 className={`text-xl sm:text-2xl font-semibold ${theme === 'dark' ? 'text-amber-300' : 'text-amber-600'}`}>
                    Work In Progress
                  </h3>
                  <p className={subText}>No tasks completed yet.</p>
                </div>
              ) : (
                <>
                  <h2 className={`text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 mt-10 sm:mt-14 ${sectionTitle}`}>
                    Completed Tasks ({completed.length})
                  </h2>
                  <div className="space-y-6 sm:space-y-8">
                    {completed.sort((a, b) => new Date(a.due) - new Date(b.due)).map((task) => {
                      const attachments = taskAttachments[task.taskId] || [];
                      const isLoading = loadingAttachments[task.taskId];
                      const isExpanded = expandedTask === task.taskId;
                      const hasAttachments = checkTaskHasAttachments(task);
                      const attachmentCount = getAttachmentCount(task);
                      
                      return (
                        <div
                          key={task.taskId}
                          className={`${cardBg} rounded-2xl border p-6 sm:p-8 hover:border-emerald-400/40 transition-all`}
                        >
                          <div className="flex flex-col lg:flex-row justify-between gap-4 sm:gap-6">
                            <div className="flex-1">
                              <div className="flex gap-2 sm:gap-3 mb-3 sm:mb-4 flex-wrap">
                                <span className={`font-mono text-xs sm:text-sm px-2 sm:px-3 py-1 rounded-full ${taskIdBadge}`}>
                                  {task.taskId}
                                </span>
                                <span className={`text-xs px-2 sm:px-3 py-1 rounded-full ${statusBadgeCompleted}`}>
                                  {task.status}
                                </span>
                                {/* Attachment indicator for completed tasks */}
                                {hasAttachments && (
                                  <button
                                    onClick={() => toggleTaskExpansion(task.taskId)}
                                    className={`text-xs sm:text-sm font-medium px-2 sm:px-3 py-1 rounded-full flex items-center gap-1 ${attachmentButtonStyles}`}
                                  >
                                    <span><CgAttachment className="h-3 w-3 sm:h-4 sm:w-4" /></span>
                                    <span>{attachmentCount} file{attachmentCount !== 1 ? 's' : ''}</span>
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
                              <h3 className={`text-xl sm:text-2xl font-semibold ${headingText}`}>
                                {task.title}
                              </h3>
                              <p className={`${subText} mt-3 sm:mt-5 text-sm sm:text-base`}>
                                {task.description}
                              </p>

                              {/* Attachments Section for Completed Tasks */}
                              {isExpanded && hasAttachments && (
                                <div className="mt-6 mb-6">
                                  <h3 className={`text-lg font-semibold mb-4 ${headingText} flex items-center gap-2`}>
                                    <span><CgAttachment className="h-3 w-3 sm:h-4 sm:w-4" /></span>
                                    <span>Attachments ({attachmentCount})</span>
                                  </h3>
                                  
                                  {isLoading ? (
                                    <div className="flex items-center justify-center py-4">
                                      <div className={`animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 ${theme === 'dark' ? 'border-emerald-500' : 'border-emerald-600'}`}></div>
                                      <span className={`ml-3 ${subText}`}>Loading files...</span>
                                    </div>
                                  ) : attachments.length === 0 ? (
                                    <div className={`text-center py-6 rounded-lg ${theme === 'dark' ? 'bg-neutral-800/50' : 'bg-neutral-100'}`}>
                                      <p className={subText}>No files attached to this task</p>
                                    </div>
                                  ) : (
                                    <div className="space-y-3">
                                      {attachments.map((file, index) => {
                                        const fileType = file.fileType || getFileTypeFromMime(file.mimetype);
                                        const fileMime = file.mimetype || '';
                                        
                                        return (
                                          <div 
                                            key={index}
                                            className={`flex flex-col xs:flex-row items-start sm:max-w-[700px] xs:items-center justify-between p-3 rounded-lg ${attachmentCardStyles} transition-colors gap-3 xs:gap-4`}
                                          >
                                            <div className="flex items-center gap-3 flex-1 min-w-0 w-full sm:w-auto">
                                              <span className="text-xl flex-shrink-0">
                                                {getFileIcon(fileType, fileMime)}
                                              </span>
                                              <div className="min-w-0 flex-1">
                                                <p className={`font-medium ${headingText} truncate`}>{file.filename}</p>
                                                <div className="flex flex-wrap items-center gap-2 text-xs text-neutral-500 mt-1">
                                                  <span>{formatFileSize(file.size)}</span>
                                                  <span>•</span>
                                                  <span className="capitalize">{fileType}</span>
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
                                              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap w-full sm:w-44 mt-2 xs:mt-0 flex-shrink-0 ${downloadButtonStyles}`}
                                            >
                                              Download
                                            </button>
                                          </div>
                                        );
                                      })}
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                            <div className="text-left lg:text-right min-w-[120px]">
                              <p className={`${subText} text-xs sm:text-sm`}>
                                Due Date
                              </p>
                              <p className={`${headingText} font-medium text-base sm:text-lg`}>
                                {formatDueDate(task.due)}
                              </p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AdminEmpTasks;