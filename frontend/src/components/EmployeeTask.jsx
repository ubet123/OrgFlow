import React, { useEffect, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/themeContext';
import { CgAttachment } from "react-icons/cg";
import useEmail from '../hooks/useEmail';
import { FaFilePdf, FaFileImage, FaFileWord, FaFileExcel, FaFilePowerpoint, FaFileAlt, FaFile, FaDownload, FaSpinner, FaClock, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';

const EmployeeTask = ({employee}) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pending, setPending] = useState([]);
  const [completed, setCompleted] = useState([]);
  const [completingTask, setCompletingTask] = useState(null);
  const [expandedTask, setExpandedTask] = useState(null);
  const [taskAttachments, setTaskAttachments] = useState({});
  const [loadingAttachments, setLoadingAttachments] = useState({});
  const [activeTab, setActiveTab] = useState('pending');
  const navigate = useNavigate();
  const { theme } = useTheme();
  const { sendTaskCompletedEmail } = useEmail();

  const API_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';

  // Custom styles for theme
  const containerStyles = theme === 'dark' 
    ? 'bg-neutral-950 text-neutral-350' 
    : 'bg-neutral-50 text-neutral-800';
  
  const cardStyles = theme === 'dark' 
    ? 'glass-card-dark shadow-[0_4px_24px_rgba(0,0,0,0.2)]' 
    : 'glass-card-light shadow-[0_2px_16px_rgba(0,0,0,0.03)]';
  
  const textColor = theme === 'dark' ? 'text-neutral-200' : 'text-neutral-800';
  const textColorSecondary = theme === 'dark' ? 'text-neutral-500' : 'text-neutral-500';
  const textColorMuted = theme === 'dark' ? 'text-neutral-600' : 'text-neutral-400';
  const accentColor = theme === 'dark' ? 'text-emerald-400' : 'text-emerald-600';
  
  const overdueCardStyles = theme === 'dark' 
    ? 'glass-card-dark border-l-2 border-l-red-500/40 shadow-[0_4px_24px_rgba(0,0,0,0.2)]' 
    : 'glass-card-light border-l-2 border-l-red-400/40 shadow-[0_2px_16px_rgba(0,0,0,0.03)]';
  
  const completedCardStyles = theme === 'dark' 
    ? 'border-l-2 border-l-emerald-500/30' 
    : 'border-l-2 border-l-emerald-400/30';

  // File icon mapping
  const getFileIcon = (fileType, mimetype) => {
    const iconClass = "text-lg text-emerald-500 flex-shrink-0";
    if (fileType === 'image' || mimetype.includes('image')) return <FaFileImage className={iconClass} />;
    if (fileType === 'pdf' || mimetype.includes('pdf')) return <FaFilePdf className={iconClass} />;
    if (fileType === 'document') return <FaFileWord className={iconClass} />;
    if (fileType === 'spreadsheet') return <FaFileExcel className={iconClass} />;
    if (fileType === 'presentation') return <FaFilePowerpoint className={iconClass} />;
    if (fileType === 'text') return <FaFileAlt className={iconClass} />;
    return <FaFile className={iconClass} />;
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
      
      // Find the completed task for email notification
      const completedTask = tasks.find(task => task.taskId === taskId);
      
      setTasks(tasks.map(task => 
        task.taskId === taskId ? { ...task, status: 'Completed' } : task
      ));

      toast.success(`${response.data.message}`);

      // Send email notification to admin
      if (completedTask) {
        sendTaskCompletedEmail({
          taskId: completedTask.taskId,
          title: completedTask.title,
          employeeName: employee?.name || 'Employee',
          completedDate: new Date().toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
          })
        });
      }

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
      <div className={`min-h-screen pt-12 px-4 pb-12 ${containerStyles}`}>
        <div className="max-w-[1400px] mx-auto">
          <div className="flex justify-center py-20">
            <div className={`animate-spin rounded-full h-8 w-8 border-2 border-t-transparent ${theme === 'dark' ? 'border-emerald-500' : 'border-emerald-600'}`}></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen pt-8 px-4 pb-12 transition-all duration-300 ${containerStyles}`}>
      <div className="max-w-[1400px] mx-auto">
        {tasks.length === 0 ? (
          <div className={`rounded-2xl p-8 sm:p-12 text-center max-w-2xl mx-auto ${cardStyles}`}>
            <svg xmlns="http://www.w3.org/2000/svg" className={`h-14 w-14 mx-auto ${accentColor} opacity-80`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <h2 className={`text-xl sm:text-2xl font-bold mt-6 tracking-tight ${textColor}`}>No Tasks Assigned</h2>
            <p className={`${textColorSecondary} mt-3 text-sm leading-relaxed max-w-md mx-auto`}>
              You currently don't have any tasks assigned. Check back later or contact your manager if you believe this is an error.
            </p>
          </div>
        ) : (
          <>
            {/* Tab Switcher */}
            <div className={`flex mb-8 max-w-[1400px] mx-auto gap-1 ${theme === 'dark' ? 'border-b border-neutral-800/40' : 'border-b border-neutral-200/40'}`}>
              <button
                onClick={() => setActiveTab('pending')}
                className={`pb-3 text-sm font-medium border-b-2 px-5 transition-all duration-300 ${
                  activeTab === 'pending'
                    ? `border-emerald-500 ${accentColor} font-semibold`
                    : `border-transparent ${textColorMuted} hover:text-neutral-300`
                }`}
              >
                Pending Tasks ({pending.length})
              </button>
              <button
                onClick={() => setActiveTab('completed')}
                className={`pb-3 text-sm font-medium border-b-2 px-5 transition-all duration-300 ${
                  activeTab === 'completed'
                    ? `border-emerald-500 ${accentColor} font-semibold`
                    : `border-transparent ${textColorMuted} hover:text-neutral-300`
                }`}
              >
                Completed Tasks ({completed.length})
              </button>
            </div>

            {/* Pending Tab Content */}
            {activeTab === 'pending' && (
              <div className="space-y-4">
                {pending.length === 0 ? (
                  <div className={`rounded-2xl p-8 text-center max-w-xl mx-auto ${cardStyles}`}>
                    <FaCheckCircle className={`h-10 w-10 mx-auto mb-4 text-emerald-500 opacity-80`} />
                    <h3 className={`text-lg font-bold mb-1.5 tracking-tight ${textColor}`}>All Caught Up!</h3>
                    <p className={`${textColorSecondary} text-sm`}>No pending tasks as of now.</p>
                  </div>
                ) : (
                  pending.sort((a, b) => new Date(a.due) - new Date(b.due)).map((task) => {
                    const overdue = isOverdue(task.due);
                    const attachments = taskAttachments[task.taskId] || [];
                    const isLoading = loadingAttachments[task.taskId];
                    const isExpanded = expandedTask === task.taskId;
                    
                    return (
                      <div 
                        key={task.taskId}
                        className={`rounded-2xl p-5 sm:p-6 w-full transition-all duration-300 hover:border-emerald-500/20 max-w-[1400px] mx-auto ${
                          overdue ? overdueCardStyles : cardStyles
                        }`}
                      >
                        <div className="flex flex-col lg:flex-row justify-between items-start gap-4 lg:gap-6">
                          <div className="flex-1 w-full min-w-0">
                            <div className="flex flex-wrap items-center gap-2 mb-3.5">
                              <button
                                type="button"
                                onClick={() => navigate(`/task/${encodeURIComponent(task.taskId)}`)}
                                className={`font-mono text-xs font-semibold ${
                                  theme === 'dark' ? 'bg-emerald-500/10 hover:bg-emerald-500/15 text-emerald-400' : 'bg-emerald-50/80 hover:bg-emerald-100/60 text-emerald-700'
                                } px-2.5 py-1 rounded-lg border border-emerald-500/10 transition-all duration-200`}
                              >
                                {task.taskId}
                              </button>
                              <span className={`text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full ${
                                overdue 
                                  ? (theme === 'dark' ? 'bg-red-500/10 text-red-400 border border-red-500/12' : 'bg-red-50/80 text-red-600 border border-red-200/40') 
                                  : (theme === 'dark' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/12' : 'bg-amber-50/80 text-amber-600 border border-amber-200/40')
                              }`}>
                                {task.status}
                              </span>
                              {overdue && (
                                <span className={`animate-pulse text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full ${
                                  theme === 'dark' ? 'bg-red-500/10 text-red-400 border border-red-500/12' : 'bg-red-50/80 text-red-600 border border-red-200/40'
                                }`}>
                                  Past Due!
                                </span>
                              )}
                              {/* Attachment indicator */}
                              {task.hasAttachments && (
                                <button
                                  onClick={() => toggleTaskExpansion(task.taskId)}
                                  className={`text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full flex items-center gap-1.5 transition-all duration-200 ${
                                    theme === 'dark' 
                                      ? 'bg-blue-500/10 text-blue-400 border border-blue-500/12 hover:bg-blue-500/15' 
                                      : 'bg-blue-50/80 text-blue-600 border border-blue-200/40 hover:bg-blue-100/60'
                                  }`}
                                >
                                  <CgAttachment className="h-3.5 w-3.5" />
                                  <span>{task.attachmentCount} file{task.attachmentCount !== 1 ? 's' : ''}</span>
                                  <svg 
                                    xmlns="http://www.w3.org/2000/svg" 
                                    className={`h-3 w-3 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} 
                                    viewBox="0 0 20 20" 
                                    fill="currentColor"
                                  >
                                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                  </svg>
                                </button>
                              )}
                            </div>
                            <h2 className={`text-lg sm:text-xl font-bold mb-2.5 tracking-tight ${
                              overdue ? (theme === 'dark' ? 'text-red-300' : 'text-red-700') : textColor
                            }`}>
                              {task.title}
                            </h2>
                            <p className={`text-sm mb-4 sm:mb-6 leading-relaxed ${
                              overdue ? (theme === 'dark' ? 'text-red-200/50' : 'text-red-600/60') : textColorSecondary
                            }`}>
                              {task.description}
                            </p>

                            {/* Attachments Section */}
                            {isExpanded && task.hasAttachments && (
                              <div className="mt-4 mb-4 pt-4 border-t border-neutral-500/10">
                                <h3 className={`text-[11px] font-semibold uppercase tracking-widest mb-3 ${textColorMuted} flex items-center gap-1.5`}>
                                  <CgAttachment className="h-3.5 w-3.5" />
                                  <span>Attachments ({attachments.length})</span>
                                </h3>
                                
                                {isLoading ? (
                                  <div className="flex items-center justify-start py-3">
                                    <FaSpinner className={`animate-spin h-4 w-4 ${theme === 'dark' ? 'text-emerald-400' : 'text-emerald-600'}`}></FaSpinner>
                                    <span className={`ml-2 text-xs ${textColorMuted}`}>Loading files...</span>
                                  </div>
                                ) : attachments.length === 0 ? (
                                  <div className={`text-left py-3 rounded-lg text-xs ${textColorSecondary}`}>
                                    No files attached to this task
                                  </div>
                                ) : (
                                  <div className="space-y-2">
                                    {attachments.map((file, index) => (
                                      <div 
                                        key={index}
                                        className={`flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 rounded-xl border sm:max-w-2xl gap-3 transition-all duration-200 ${
                                          theme === 'dark' ? 'bg-neutral-900/30 border-neutral-800/40 hover:bg-neutral-800/30' : 'bg-white/40 border-neutral-200/40 hover:bg-neutral-50/60'
                                        }`}
                                      >
                                        <div className="flex items-center gap-3 flex-1 min-w-0 w-full">
                                          <div className={`p-1.5 rounded-lg flex-shrink-0 ${theme === 'dark' ? 'bg-emerald-500/10' : 'bg-emerald-50/80'}`}>
                                            {getFileIcon(file.fileType, file.mimetype)}
                                          </div>
                                          <div className="min-w-0 flex-1">
                                            <p className={`text-sm font-medium truncate ${textColor}`}>{file.filename}</p>
                                            <div className={`flex items-center gap-1.5 text-xs mt-0.5 ${textColorMuted}`}>
                                              <span>{formatFileSize(file.size)}</span>
                                              <span>•</span>
                                              <span className="capitalize">{file.fileType}</span>
                                              {file.uploadedAt && (
                                                <>
                                                  <span>•</span>
                                                  <span>Added {formatDate(file.uploadedAt)}</span>
                                                </>
                                              )}
                                            </div>
                                          </div>
                                        </div>
                                        <button
                                          onClick={() => handleDownload(file.url, file.filename)}
                                          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 flex items-center justify-center gap-1.5 w-full sm:w-auto ${
                                            theme === 'dark' 
                                              ? 'bg-emerald-500/10 border border-emerald-500/15 hover:bg-emerald-500/15 text-emerald-400' 
                                              : 'bg-emerald-50/80 border border-emerald-200/40 hover:bg-emerald-100/60 text-emerald-700'
                                          }`}
                                        >
                                          <FaDownload /> Download
                                        </button>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            )}

                            <div className="flex flex-col sm:flex-row gap-3 mt-6">
                              <button
                                onClick={() => handleMarkComplete(task.taskId)}
                                disabled={completingTask === task.taskId}
                                className={`px-5 py-2.5 rounded-xl transition-all duration-300 font-semibold flex items-center justify-center text-sm w-full sm:w-72 disabled:opacity-50 disabled:cursor-not-allowed ${
                                  overdue
                                    ? 'bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white hover:shadow-[0_0_16px_rgba(239,68,68,0.15)] active:scale-[0.98]'
                                    : 'bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white hover:shadow-[0_0_16px_rgba(16,185,129,0.15)] active:scale-[0.98]'
                                }`}
                              >
                                {completingTask === task.taskId ? (
                                  <>
                                    <FaSpinner className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" />
                                    <span>Completing...</span>
                                  </>
                                ) : (
                                  <>
                                    <FaCheckCircle className="mr-2 h-4 w-4" />
                                    <span>Mark Complete</span>
                                  </>
                                )}
                              </button>
                            </div>
                          </div>
                          
                          <div className="flex flex-col items-start lg:items-end w-full lg:w-auto lg:min-w-[150px] mt-4 lg:mt-0 pt-4 lg:pt-0 border-t border-neutral-500/10 lg:border-t-0">
                            <p className={`text-[11px] font-semibold uppercase tracking-widest ${textColorMuted} mb-1 flex items-center gap-1`}>
                              <FaClock className="text-[10px]" /> Due Date
                            </p>
                            <p className={`text-base font-semibold ${
                              overdue ? (theme === 'dark' ? 'text-red-400' : 'text-red-700') : textColor
                            }`}>
                              {formatDueDate(task.due)}
                              {overdue && (
                                <span className={`block text-xs font-medium mt-1 ${theme === 'dark' ? 'text-red-400/70' : 'text-red-600/70'}`}>
                                  (Was due {formatDueDate(task.due)})
                                </span>
                              )}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            )}

            {/* Completed Tab Content */}
            {activeTab === 'completed' && (
              <div className="space-y-4">
                {completed.length === 0 ? (
                  <div className={`rounded-2xl p-8 text-center max-w-xl mx-auto ${cardStyles}`}>
                    <FaClock className={`h-10 w-10 mx-auto mb-4 text-amber-500 opacity-80`} />
                    <h3 className={`text-lg font-bold mb-1.5 tracking-tight ${textColor}`}>Work In Progress</h3>
                    <p className={`${textColorSecondary} text-sm`}>No tasks completed yet. Keep going!</p>
                  </div>
                ) : (
                  completed.sort((a, b) => new Date(a.due) - new Date(b.due)).map((task) => {
                    const attachments = taskAttachments[task.taskId] || [];
                    const isLoading = loadingAttachments[task.taskId];
                    const isExpanded = expandedTask === task.taskId;
                    
                    return (
                      <div 
                        key={task.taskId}
                        className={`rounded-2xl p-5 sm:p-6 w-full transition-all duration-300 max-w-[1400px] mx-auto ${cardStyles} ${completedCardStyles}`}
                      >
                        <div className="flex flex-col lg:flex-row justify-between items-start gap-4 lg:gap-6">
                          <div className="flex-1 w-full min-w-0">
                            <div className="flex flex-wrap items-center gap-2 mb-3.5">
                              <button
                                type="button"
                                onClick={() => navigate(`/task/${encodeURIComponent(task.taskId)}`)}
                                className={`font-mono text-xs font-semibold ${
                                  theme === 'dark' ? 'bg-emerald-500/10 hover:bg-emerald-500/15 text-emerald-400' : 'bg-emerald-50/80 hover:bg-emerald-100/60 text-emerald-700'
                                } px-2.5 py-1 rounded-lg border border-emerald-500/10 transition-all duration-200`}
                              >
                                {task.taskId}
                              </button>
                              <span className={`text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/12`}>
                                {task.status}
                              </span>
                              {/* Attachment indicator */}
                              {task.hasAttachments && (
                                <button
                                  onClick={() => toggleTaskExpansion(task.taskId)}
                                  className={`text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full flex items-center gap-1.5 transition-all duration-200 ${
                                    theme === 'dark' 
                                      ? 'bg-blue-500/10 text-blue-400 border border-blue-500/12 hover:bg-blue-500/15' 
                                      : 'bg-blue-50/80 text-blue-600 border border-blue-200/40 hover:bg-blue-100/60'
                                  }`}
                                >
                                  <CgAttachment className="h-3.5 w-3.5" />
                                  <span>{task.attachmentCount} file{task.attachmentCount !== 1 ? 's' : ''}</span>
                                  <svg 
                                    xmlns="http://www.w3.org/2000/svg" 
                                    className={`h-3 w-3 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} 
                                    viewBox="0 0 20 20" 
                                    fill="currentColor"
                                  >
                                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                  </svg>
                                </button>
                              )}
                            </div>
                            <h2 className={`text-lg sm:text-xl font-bold mb-2.5 tracking-tight ${theme === 'dark' ? 'text-neutral-500/60' : 'text-neutral-400/60'} line-through`}>
                              {task.title}
                            </h2>
                            <p className={`text-sm mb-4 sm:mb-6 leading-relaxed ${textColorSecondary}`}>
                              {task.description}
                            </p>

                            {/* Attachments Section */}
                            {isExpanded && task.hasAttachments && (
                              <div className="mt-4 mb-4 pt-4 border-t border-neutral-500/10">
                                <h3 className={`text-[11px] font-semibold uppercase tracking-widest mb-3 ${textColorMuted} flex items-center gap-1.5`}>
                                  <CgAttachment className="h-3.5 w-3.5" />
                                  <span>Attachments ({attachments.length})</span>
                                </h3>
                                
                                {isLoading ? (
                                  <div className="flex items-center justify-start py-3">
                                    <FaSpinner className={`animate-spin h-4 w-4 ${theme === 'dark' ? 'text-emerald-500' : 'text-emerald-600'}`}></FaSpinner>
                                    <span className={`ml-2 text-xs ${textColorMuted}`}>Loading files...</span>
                                  </div>
                                ) : attachments.length === 0 ? (
                                  <div className={`text-left py-3 rounded-lg text-xs ${textColorSecondary}`}>
                                    No files attached to this task
                                  </div>
                                ) : (
                                  <div className="space-y-2">
                                    {attachments.map((file, index) => (
                                      <div 
                                        key={index}
                                        className={`flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 rounded-xl border sm:max-w-2xl gap-3 transition-all duration-200 ${
                                          theme === 'dark' ? 'bg-neutral-900/30 border-neutral-800/40 hover:bg-neutral-800/30' : 'bg-white/40 border-neutral-200/40 hover:bg-neutral-50/60'
                                        }`}
                                      >
                                        <div className="flex items-center gap-3 flex-1 min-w-0 w-full">
                                          <div className={`p-1.5 rounded-lg flex-shrink-0 ${theme === 'dark' ? 'bg-emerald-500/10' : 'bg-emerald-50/80'}`}>
                                            {getFileIcon(file.fileType, file.mimetype)}
                                          </div>
                                          <div className="min-w-0 flex-1">
                                            <p className={`text-sm font-medium truncate ${textColor}`}>{file.filename}</p>
                                            <div className={`flex items-center gap-1.5 text-xs mt-0.5 ${textColorMuted}`}>
                                              <span>{formatFileSize(file.size)}</span>
                                              <span>•</span>
                                              <span className="capitalize">{file.fileType}</span>
                                              {file.uploadedAt && (
                                                <>
                                                  <span>•</span>
                                                  <span>Added {formatDate(file.uploadedAt)}</span>
                                                </>
                                              )}
                                            </div>
                                          </div>
                                        </div>
                                        <button
                                          onClick={() => handleDownload(file.url, file.filename)}
                                          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 flex items-center justify-center gap-1.5 w-full sm:w-auto ${
                                            theme === 'dark' 
                                              ? 'bg-emerald-500/10 border border-emerald-500/15 hover:bg-emerald-500/15 text-emerald-400' 
                                              : 'bg-emerald-50/80 border border-emerald-200/40 hover:bg-emerald-100/60 text-emerald-700'
                                          }`}
                                        >
                                          <FaDownload /> Download
                                        </button>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            )}

                            <div className="flex flex-col sm:flex-row gap-3 mt-6">
                              <button
                                disabled
                                className={`px-5 py-2.5 rounded-xl font-medium flex items-center justify-center text-sm w-full sm:w-72 cursor-not-allowed opacity-50 ${
                                  theme === 'dark' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/12' : 'bg-emerald-50/80 text-emerald-700 border border-emerald-200/30'
                                }`}
                              >
                                <FaCheckCircle className="mr-2 h-4 w-4" />
                                <span>Task Completed</span>
                              </button>
                            </div>
                          </div>
                          
                          <div className="flex flex-col items-start lg:items-end w-full lg:w-auto lg:min-w-[150px] mt-4 lg:mt-0 pt-4 lg:pt-0 border-t border-neutral-500/10 lg:border-t-0">
                            <p className={`text-[11px] font-semibold uppercase tracking-widest ${textColorMuted} mb-1 flex items-center gap-1`}>
                              <FaClock className="text-[10px]" /> Completed
                            </p>
                            <p className={`text-base font-semibold ${textColor}`}>
                              {formatDueDate(task.due)}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default EmployeeTask;