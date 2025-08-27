import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { IoIosArrowBack } from "react-icons/io";
import { useTheme } from '../context/themeContext';

const AdminEmpTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pending, setPending] = useState([]);
  const [completed, setCompleted] = useState([]);

  const { id } = useParams();
  const employeeName = id ? decodeURIComponent(id) : '';
  const navigate = useNavigate();
  const { theme } = useTheme();

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
        const response = await axios.get('http://localhost:3001/task/adminemptasks', {
          params: { employee: employeeName },
        });
        setTasks(response.data.tasks);
      } catch (error) {
        console.error('Error fetching tasks:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchTasks();
  }, [employeeName]);

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

  // Theme styles
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

  if (loading) {
    return (
      <div className={`min-h-screen ${pageBg} flex items-center justify-center`}>
        <div className={`animate-spin rounded-full h-14 w-14 border-t-2 border-b-2 ${theme === 'dark' ? 'border-emerald-400' : 'border-emerald-600'}`}></div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${pageBg} pt-14 px-6 pb-14`}>
      {/* Header */}
      <div className="mb-10 max-w-7xl mx-auto flex items-center justify-between">
        <h1 className="flex items-end gap-3 font-extrabold">
          <span className={`font-mono text-3xl sm:text-5xl ${headingText}`}>
            {employeeName || 'Employee'}
          </span>
          <span className={`${accentText} text-2xl sm:text-4xl`}>
            ’s Tasks
          </span>
        </h1>
        <button
          onClick={() => navigate('/manager-dashboard')}
          className={`flex items-center gap-2 px-5 py-3 rounded-xl transition-all text-lg ${backButtonStyles}`}
        >
          <IoIosArrowBack className="text-xl" />
          <span>Back</span>
        </button>
      </div>

      <div className="relative mt-2 mb-20">
        <div className={`absolute bottom-0 left-0 w-full h-px ${dividerBg}`}></div>
      </div>

      {/* Main */}
      <div className="max-w-7xl mx-auto space-y-14">
        {tasks.length === 0 ? (
          <div className={`${cardBg} backdrop-blur-sm rounded-2xl border p-10 text-center`}>
            <svg xmlns="http://www.w3.org/2000/svg" className={`h-20 w-20 mx-auto ${theme === 'dark' ? 'text-emerald-500' : 'text-emerald-600'} mb-6`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <h2 className={`text-3xl font-semibold ${headingText}`}>No Tasks Assigned</h2>
          </div>
        ) : (
          <>
            {/* Pending */}
            <div>
              {pending.length === 0 ? (
                <div className={`${cardBg} rounded-2xl border p-8 text-center`}>
                  <h3 className={`text-2xl font-semibold ${sectionTitle}`}>All Caught Up!</h3>
                  <p className={subText}>No pending tasks right now.</p>
                </div>
              ) : (
                <>
                  <h2 className={`text-3xl font-bold mb-8 ${sectionTitle}`}>Pending Tasks ({pending.length})</h2>
                  <div className="space-y-8">
                    {pending.sort((a, b) => new Date(a.due) - new Date(b.due)).map((task) => {
                      const overdue = isOverdue(task.due);
                      return (
                        <div
                          key={task.taskId}
                          className={`rounded-2xl border p-8 transition-all ${
                            overdue
                              ? overdueCardStyles
                              : `${cardBg} hover:border-emerald-400/40`
                          }`}
                        >
                          <div className="flex flex-col md:flex-row justify-between gap-6">
                            <div>
                              <div className="flex gap-3 mb-4 flex-wrap">
                                <span className={`font-mono text-sm px-3 py-1 rounded-full ${taskIdBadge}`}>
                                  {task.taskId}
                                </span>
                                <span className={`text-xs px-3 py-1 rounded-full ${
                                  overdue
                                    ? 'bg-red-700 text-white'
                                    : statusBadgePending
                                }`}>
                                  {task.status}
                                </span>
                                {overdue && (
                                  <span className="animate-pulse text-xs px-3 py-1 rounded-full bg-red-600 text-white">
                                    Past Due!
                                  </span>
                                )}
                              </div>
                              <h3 className={`text-2xl font-semibold ${overdue ? (theme === 'dark' ? 'text-white' : 'text-red-900') : headingText}`}>
                                {task.title}
                              </h3>
                              <p className={`${overdue ? (theme === 'dark' ? 'text-red-100' : 'text-red-800') : subText} mt-5`}>
                                {task.description}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className={`${overdue ? (theme === 'dark' ? 'text-red-200' : 'text-red-700') : subText} text-sm`}>
                                Due Date
                              </p>
                              <p className={`${overdue ? (theme === 'dark' ? 'text-white' : 'text-red-900') : headingText} font-medium text-lg`}>
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

            {/* Completed */}
            <div>
              {completed.length === 0 ? (
                <div className={`${cardBg} rounded-2xl border p-8 text-center`}>
                  <h3 className={`text-2xl font-semibold ${theme === 'dark' ? 'text-amber-300' : 'text-amber-600'}`}>
                    Work In Progress
                  </h3>
                  <p className={subText}>No tasks completed yet.</p>
                </div>
              ) : (
                <>
                  <h2 className={`text-3xl font-bold mb-8 mt-14 ${sectionTitle}`}>
                    Completed Tasks ({completed.length})
                  </h2>
                  <div className="space-y-8">
                    {completed.sort((a, b) => new Date(a.due) - new Date(b.due)).map((task) => (
                      <div
                        key={task.taskId}
                        className={`${cardBg} rounded-2xl border p-8 hover:border-emerald-400/40 transition-all`}
                      >
                        <div className="flex flex-col md:flex-row justify-between gap-6">
                          <div>
                            <div className="flex gap-3 mb-4 flex-wrap">
                              <span className={`font-mono text-sm px-3 py-1 rounded-full ${taskIdBadge}`}>
                                {task.taskId}
                              </span>
                              <span className={`text-xs px-3 py-1 rounded-full ${statusBadgeCompleted}`}>
                                {task.status}
                              </span>
                            </div>
                            <h3 className={`text-2xl font-semibold ${headingText}`}>
                              {task.title}
                            </h3>
                            <p className={`${subText} mt-5`}>
                              {task.description}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className={`${subText} text-sm`}>
                              Due Date
                            </p>
                            <p className={`${headingText} font-medium text-lg`}>
                              {formatDueDate(task.due)}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
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