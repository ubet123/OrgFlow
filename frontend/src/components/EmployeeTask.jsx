import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useTheme } from '../context/themeContext';

const EmployeeTask = ({employee}) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pending, setPending] = useState([]);
  const [completed, setCompleted] = useState([]);
  const [completingTask, setCompletingTask] = useState(null);
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
                    return (
                      <div 
                        key={task.taskId}
                        className={`backdrop-blur-sm rounded-xl sm:rounded-2xl border-2 p-4 sm:p-6 md:p-8 w-full transition-all hover:border-emerald-500/30 ${
                          overdue ? overdueCardStyles : cardStyles
                        }`}
                      >
                        <div className="flex flex-col md:flex-row justify-between items-start gap-4 md:gap-6">
                          <div className="flex-1">
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
                            <button
                              onClick={() => handleMarkComplete(task.taskId)}
                              disabled={completingTask === task.taskId}
                              className={`${
                                overdue
                                  ? 'bg-red-700 hover:bg-red-600'
                                  : 'bg-emerald-700 hover:bg-emerald-600'
                              } text-white px-4 sm:px-6 md:px-8 py-2 sm:py-3 rounded-lg transition-colors font-medium mt-4 sm:mt-6 flex items-center justify-center text-base sm:text-lg w-full sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed`}
                            >
                              {completingTask === task.taskId ? (
                                <>
                                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 sm:h-5 sm:w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                  </svg>
                                  Completing...
                                </>
                              ) : (
                                <>
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                  </svg>
                                  Mark Complete
                                </>
                              )}
                            </button>
                          </div>
                          
                          <div className="flex flex-col items-end w-full md:w-auto md:min-w-[200px] mt-4 md:mt-0">
                            <div className="text-right">
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
                    .map((task) => (
                      <div 
                        key={task.taskId}
                        className={`backdrop-blur-sm rounded-xl sm:rounded-2xl border-2 p-4 sm:p-6 md:p-8 w-full transition-all hover:border-emerald-500/30 ${cardStyles} ${completedCardStyles}`}
                      >
                        <div className="flex flex-col md:flex-row justify-between items-start gap-4 md:gap-6">
                          <div className="flex-1">
                            <div className="flex flex-wrap items-center gap-2 sm:gap-4 mb-3 sm:mb-4">
                              <span className={`font-mono text-sm sm:text-base md:text-lg ${accentColor} ${theme === 'dark' ? 'bg-emerald-900/20' : 'bg-emerald-100'} px-3 py-1 sm:px-4 sm:py-1.5 rounded-full`}>
                                {task.taskId}
                              </span>
                              <span className={`text-xs sm:text-sm font-medium px-2 py-1 sm:px-3 sm:py-1.5 rounded-full ${
                                theme === 'dark' ? 'bg-emerald-900/50 text-emerald-300' : 'bg-emerald-200 text-emerald-800'
                              }`}>
                                {task.status}
                              </span>
                            </div>
                            <h2 className={`text-xl sm:text-2xl font-semibold mb-2 sm:mb-4 ${textColor}`}>{task.title}</h2>
                            <p className={`${textColorSecondary} text-base sm:text-lg mb-4 sm:mb-6 leading-relaxed`}>{task.description}</p>
                            <button
                              disabled
                              className={`${theme === 'dark' ? 'bg-emerald-900 text-emerald-300' : 'bg-emerald-100 text-emerald-800'} px-4 sm:px-6 md:px-8 py-2 sm:py-3 rounded-lg font-medium mt-4 sm:mt-6 flex items-center justify-center text-base sm:text-lg min-w-72 sm:w-auto cursor-not-allowed opacity-70`}
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                              Task Completed 
                            </button>
                          </div>
                          
                          <div className="flex flex-col items-end w-full md:w-auto md:min-w-[200px] mt-4 md:mt-0">
                            <div className="text-right">
                              <p className={`text-xs sm:text-sm ${textColorMuted} mb-1`}>Due Date</p>
                              <p className={`text-base sm:text-lg font-medium ${textColor}`}>
                                {formatDueDate(task.due)}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
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