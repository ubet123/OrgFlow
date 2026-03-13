import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { useTheme } from '../context/themeContext';
import { IoIosArrowBack } from 'react-icons/io';
import { FiClock, FiEdit2, FiCheckCircle, FiPaperclip, FiUserPlus, FiFileText } from 'react-icons/fi';

const TaskDetails = () => {
  const { taskId } = useParams();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const API_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';

  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTaskDetails = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${API_URL}/task/detail/${taskId}`, {
          withCredentials: true
        });

        if (res.data.success) {
          setTask(res.data.task);
        }
      } catch (error) {
        console.error('Error fetching task details:', error);
      } finally {
        setLoading(false);
      }
    };

    if (taskId) {
      fetchTaskDetails();
    }
  }, [API_URL, taskId]);

  const pageStyles = theme === 'dark' ? 'bg-neutral-950 text-neutral-200' : 'bg-neutral-50 text-neutral-800';
  const cardStyles = theme === 'dark' ? 'bg-neutral-900/80 border-neutral-800' : 'bg-white border-neutral-200';
  const secondaryCardStyles = theme === 'dark' ? 'bg-neutral-900/50 border-neutral-800' : 'bg-neutral-100/70 border-neutral-200';
  const accentText = theme === 'dark' ? 'text-emerald-400' : 'text-emerald-600';
  const secondaryText = theme === 'dark' ? 'text-neutral-400' : 'text-neutral-600';
  const timelineConnector = theme === 'dark' ? 'bg-emerald-500/55' : 'bg-emerald-500/75';

  const statusStyles = {
    Pending: theme === 'dark' ? 'bg-amber-900/50 text-amber-300' : 'bg-amber-100 text-amber-700',
    'In Progress': theme === 'dark' ? 'bg-blue-900/50 text-blue-300' : 'bg-blue-100 text-blue-700',
    Completed: theme === 'dark' ? 'bg-emerald-900/50 text-emerald-300' : 'bg-emerald-100 text-emerald-700'
  };

  const formatDateTime = (dateValue) => {
    const date = new Date(dateValue);
    if (Number.isNaN(date.getTime())) return 'Invalid date';
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDate = (dateValue) => {
    const date = new Date(dateValue);
    if (Number.isNaN(date.getTime())) return 'Invalid date';
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getActivityIcon = (action) => {
    switch (action) {
      case 'created':
        return <FiFileText className="h-4 w-4" />;
      case 'updated':
        return <FiEdit2 className="h-4 w-4" />;
      case 'status_changed':
        return <FiCheckCircle className="h-4 w-4" />;
      case 'assigned_changed':
        return <FiUserPlus className="h-4 w-4" />;
      case 'attachment_added':
        return <FiPaperclip className="h-4 w-4" />;
      default:
        return <FiClock className="h-4 w-4" />;
    }
  };

  const getActivityTone = (action) => {
    switch (action) {
      case 'created':
        return theme === 'dark'
          ? 'border-blue-500/50 bg-blue-900/30 text-blue-300'
          : 'border-blue-300 bg-blue-100 text-blue-700';
      case 'updated':
        return theme === 'dark'
          ? 'border-violet-500/50 bg-violet-900/30 text-violet-300'
          : 'border-violet-300 bg-violet-100 text-violet-700';
      case 'status_changed':
        return theme === 'dark'
          ? 'border-emerald-500/50 bg-emerald-900/30 text-emerald-300'
          : 'border-emerald-300 bg-emerald-100 text-emerald-700';
      case 'assigned_changed':
        return theme === 'dark'
          ? 'border-amber-500/50 bg-amber-900/30 text-amber-300'
          : 'border-amber-300 bg-amber-100 text-amber-700';
      case 'attachment_added':
        return theme === 'dark'
          ? 'border-cyan-500/50 bg-cyan-900/30 text-cyan-300'
          : 'border-cyan-300 bg-cyan-100 text-cyan-700';
      default:
        return theme === 'dark'
          ? 'border-neutral-600 bg-neutral-800 text-neutral-300'
          : 'border-neutral-300 bg-neutral-100 text-neutral-700';
    }
  };

  const handleDownload = (url, filename) => {
    const link = document.createElement('a');
    link.href = url;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    if (filename) {
      link.download = filename;
    }
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <div className={`min-h-screen ${pageStyles} flex items-center justify-center`}>
        <div className={`animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 ${theme === 'dark' ? 'border-emerald-400' : 'border-emerald-600'}`} />
      </div>
    );
  }

  if (!task) {
    return (
      <div className={`min-h-screen ${pageStyles} px-4 py-12`}>
        <div className={`max-w-5xl mx-auto rounded-xl border p-8 text-center ${cardStyles}`}>
          <h2 className="text-xl font-semibold">Task not found</h2>
          <button
            onClick={() => navigate(-1)}
            className={`mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-lg ${theme === 'dark' ? 'bg-neutral-800 text-neutral-200' : 'bg-neutral-200 text-neutral-800'}`}
          >
            <IoIosArrowBack className="h-4 w-4" />
            <span>Go Back</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${pageStyles} px-4 py-8 sm:py-10`}>
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex flex-col items-start sm:flex-row sm:items-center sm:justify-between gap-3">
          <button
            onClick={() => navigate(-1)}
            className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg border transition-colors w-fit ${theme === 'dark' ? 'bg-neutral-900/70 border-neutral-700 text-neutral-200 hover:bg-neutral-800' : 'bg-white border-neutral-300 text-neutral-700 hover:bg-neutral-100'}`}
          >
            <IoIosArrowBack className="h-4 w-4" />
            <span>Back</span>
          </button>
          <span className={`inline-flex w-fit self-start font-mono text-sm sm:text-base px-3 py-1 rounded-full whitespace-nowrap ${theme === 'dark' ? 'bg-emerald-900/40 text-emerald-300' : 'bg-emerald-100 text-emerald-700'}`}>
            {task.taskId}
          </span>
        </div>

        <section className={`rounded-xl border p-5 sm:p-6 ${cardStyles}`}>
          <div className="flex flex-col items-start sm:flex-row sm:items-start sm:justify-between gap-4">
            <div className="min-w-0">
              <h1 className={`text-2xl sm:text-3xl font-bold ${accentText}`}>{task.title}</h1>
              <p className={`mt-3 text-sm sm:text-base leading-relaxed ${secondaryText}`}>{task.description}</p>
            </div>
            <span className={`inline-flex w-fit self-start text-xs sm:text-sm font-medium px-3 py-1.5 rounded-full h-fit whitespace-nowrap ${statusStyles[task.status] || statusStyles.Pending}`}>
              {task.status}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-5">
            <div className={`rounded-lg border p-3 ${secondaryCardStyles}`}>
              <p className={`text-xs ${secondaryText}`}>Assigned To</p>
              <p className="text-sm sm:text-base font-semibold mt-1">{task.assigned}</p>
            </div>
            <div className={`rounded-lg border p-3 ${secondaryCardStyles}`}>
              <p className={`text-xs ${secondaryText}`}>Due Date</p>
              <p className="text-sm sm:text-base font-semibold mt-1">{formatDate(task.due)}</p>
            </div>
            <div className={`rounded-lg border p-3 ${secondaryCardStyles}`}>
              <p className={`text-xs ${secondaryText}`}>Created</p>
              <p className="text-sm sm:text-base font-semibold mt-1">{formatDate(task.createdAt)}</p>
            </div>
          </div>

          <div className="mt-5">
            <h2 className="text-sm font-semibold mb-2">Attachments</h2>
            {!task.attachments || task.attachments.length === 0 ? (
              <p className={`text-sm ${secondaryText}`}>No attachments</p>
            ) : (
              <div className="space-y-2">
                {task.attachments.map((file, index) => (
                  <div key={`${file.public_id || file.url}-${index}`} className={`flex items-center justify-between gap-3 rounded-lg border px-3 py-2 ${secondaryCardStyles}`}>
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate">{file.filename || 'Attachment'}</p>
                      <p className={`text-xs ${secondaryText}`}>{file.mimetype || 'File'}</p>
                    </div>
                    <button
                      onClick={() => handleDownload(file.url, file.filename)}
                      className={`text-xs px-3 py-1.5 rounded-lg transition-colors ${theme === 'dark' ? 'bg-emerald-800 hover:bg-emerald-700 text-emerald-100' : 'bg-emerald-600 hover:bg-emerald-700 text-white'}`}
                    >
                      Open
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        <section className={`rounded-xl border p-5 sm:p-6 ${cardStyles}`}>
          <div className="flex items-center justify-between mb-4">
            <h2 className={`text-lg sm:text-xl font-semibold ${accentText}`}>Activity Log</h2>
            <span className={`text-xs sm:text-sm ${secondaryText}`}>{(task.activityLogs || []).length} entries</span>
          </div>

          {!task.activityLogs || task.activityLogs.length === 0 ? (
            <div className={`rounded-lg border p-5 text-center ${secondaryCardStyles}`}>
              <p className={`text-sm ${secondaryText}`}>No activity entries available for this task yet.</p>
            </div>
          ) : (
            <div className="relative">
              <div className={`absolute left-4 top-[17px] bottom-[17px] w-[2px] ${timelineConnector}`} />

              <div className="space-y-4">
                {task.activityLogs.map((log, idx) => {
                  const tone = getActivityTone(log.action);
                  return (
                    <div key={`${log.createdAt}-${idx}`} className="relative pl-12">
                      <div className={`absolute left-0 top-1 h-8 w-8 rounded-full border flex items-center justify-center ${theme === 'dark' ? 'bg-neutral-900' : 'bg-white'} ${tone}`}>
                        {getActivityIcon(log.action)}
                      </div>

                      <div className={`rounded-xl border p-4 ${secondaryCardStyles}`}>
                        <p className="text-sm sm:text-base font-medium leading-relaxed">{log.message}</p>
                        <div className={`mt-2 text-xs flex flex-wrap items-center gap-2 ${secondaryText}`}>
                          <span className={`px-2 py-0.5 rounded-full ${theme === 'dark' ? 'bg-neutral-800 text-neutral-300' : 'bg-neutral-200 text-neutral-700'}`}>
                            {log.actorName || 'System'}
                          </span>
                          <span>•</span>
                          <span>{formatDateTime(log.createdAt)}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}

                <div className="relative pl-12">
                  <div className={`absolute left-0 top-1 h-8 w-8 rounded-full border-2 flex items-center justify-center ${theme === 'dark' ? 'bg-neutral-900 border-emerald-400' : 'bg-white border-emerald-500'}`}>
                    <span className={`h-2.5 w-2.5 rounded-full ${theme === 'dark' ? 'bg-emerald-400' : 'bg-emerald-500'}`} />
                  </div>
                  <p className={`pt-3 text-xs font-medium ${secondaryText}`}>Timeline Start</p>
                </div>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default TaskDetails;
