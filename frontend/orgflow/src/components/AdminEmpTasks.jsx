import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { IoIosArrowBack } from "react-icons/io";

const AdminEmpTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pending, setPending] = useState([]);
  const [completed, setCompleted] = useState([]);
  const [completingTask, setCompletingTask] = useState(null);


  const { id } = useParams();
  const employeeName = id ? decodeURIComponent(id) : '';

  const navigate =useNavigate()

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

  

//   const handleMarkComplete = async (taskId) => {
//     try {
//       setCompletingTask(taskId);
//       await axios.patch('http://localhost:3001/task/complete', { taskId });
//       setTasks(tasks.map(task => 
//         task.taskId === taskId ? { ...task, status: 'Completed' } : task
//       ));
//     } catch (error) {
//       console.error('Error marking task complete:', error);
//     } finally {
//       setCompletingTask(null);
//     }
//   };

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
      <div className="min-h-screen bg-neutral-950 text-neutral-300 pt-12 px-4 pb-11">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-300 pt-12 px-4 pb-11">
   <div className="mb-8">
    <div className='flex flex-row items-center justify-between md:gap-0   md:justify-between mr-20'>
      <div className="flex items-end gap-4">
    <h1 className="md:text-4xl font-extrabold text-white">
      <span className="text-neutral-300 pl-3 font-extrabold font-mono text-xl sm:text-5xl">{employeeName || 'Employee'}</span>
      <span className="text-emerald-300 sm:text-3xl">'s Tasks</span>
    </h1>
    
  </div>

  <div
   onClick={() => navigate('/manager-dashboard')}
  className="inline-block  md:px-5 md:py-2.5 md:text-base md:font-medium text-sm px-3 py-2 text-emerald-400 bg-neutral-900/70 border border-emerald-400/20 rounded-lg hover:bg-neutral-800/90 cursor-pointer">
  <div className="flex items-center justify-center gap-2">
    <span className="md:text-xl"><IoIosArrowBack /></span>
    <span>Back</span>
  </div>
</div>
    </div>
  
  <div className="mt-2 h-px bg-gradient-to-r from-emerald-500/20 via-amber-500/10 to-transparent"></div>
</div>
      <div className="max-w-7xl mx-auto">
        {tasks.length === 0 ? (
          <div className="bg-neutral-900/80 backdrop-blur-sm rounded-xl sm:rounded-2xl border-2 border-neutral-800 p-6 sm:p-8 md:p-12 text-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 sm:h-20 w-16 sm:w-20 mx-auto text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <h2 className="text-xl sm:text-2xl font-semibold text-white mt-4 sm:mt-6">No Tasks Assigned</h2>
           
          </div>
        ) : (
          <>
            {/* Pending Tasks */}
            <div className="space-y-4 sm:space-y-6 md:space-y-8">
              {pending.length === 0 ? (
                <div className="bg-neutral-900/80 backdrop-blur-sm rounded-xl sm:rounded-2xl border-2 border-neutral-800 p-4 sm:p-6 md:p-8 text-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 sm:h-16 w-12 sm:w-16 mx-auto text-emerald-400 mb-2 sm:mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <h3 className="text-xl sm:text-2xl font-semibold text-emerald-300 mb-1 sm:mb-2">All Caught Up!</h3>
                  <p className="text-neutral-400 text-base sm:text-lg">No pending tasks as of now.</p>
                </div>
              ) : (
                <>
                  <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-emerald-400 mb-6 sm:mb-8 md:mb-10">Pending Tasks ({pending.length})</h1>
                  {pending.sort((a, b) => new Date(a.due) - new Date(b.due)).map((task) => {
                    const overdue = isOverdue(task.due);
                    return (
                      <div 
                        key={task.taskId}
                        className={`bg-neutral-900/80 backdrop-blur-sm rounded-xl sm:rounded-2xl border-2 p-4 sm:p-6 md:p-8 w-full transition-all hover:border-emerald-500/30 ${
                          overdue 
                            ? 'border-red-500/50 bg-red-900/10' 
                            : 'border-neutral-800'
                        }`}
                      >
                        <div className="flex flex-col md:flex-row justify-between items-start gap-4 md:gap-6">
                          <div className="flex-1">
                            <div className="flex flex-wrap items-center gap-2 sm:gap-4 mb-3 sm:mb-4">
                              <span className="font-mono text-sm sm:text-base md:text-lg text-emerald-400 bg-emerald-900/20 px-3 py-1 sm:px-4 sm:py-1.5 rounded-full">
                                {task.taskId}
                              </span>
                              <span className={`text-xs sm:text-sm font-medium px-2 py-1 sm:px-3 sm:py-1.5 rounded-full ${
                                overdue 
                                  ? 'bg-red-900/50 text-red-300' 
                                  : 'bg-amber-900/50 text-amber-300'
                              }`}>
                                {task.status}
                              </span>
                              {overdue && (
                                <span className="animate-pulse text-xs sm:text-sm font-medium px-2 py-1 sm:px-3 sm:py-1.5 rounded-full bg-red-900/50 text-red-300">
                                  Past Due!
                                </span>
                              )}
                            </div>
                            <h2 className={`text-xl sm:text-2xl font-semibold mb-2 sm:mb-4 ${
                              overdue ? 'text-red-300' : 'text-white'
                            }`}>
                              {task.title}
                            </h2>
                            <p className={`text-base sm:text-lg mb-4 sm:mb-6 leading-relaxed ${
                              overdue ? 'text-red-200/80' : 'text-neutral-300'
                            }`}>
                              {task.description}
                            </p>
                        
                          </div>
                          
                          <div className="flex flex-col items-end w-full md:w-auto md:min-w-[200px] mt-4 md:mt-0">
                            <div className="text-right">
                              <p className="text-xs sm:text-sm text-neutral-500 mb-1">Due Date</p>
                              <p className={`text-base sm:text-lg font-medium ${
                                overdue ? 'text-red-300' : 'text-white'
                              }`}>
                                {formatDueDate(task.due)}
                                {overdue && (
                                  <span className="block text-xs text-red-400 mt-1">(Was due {formatDueDate(task.due)})</span>
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
              <div className="bg-neutral-900/80 backdrop-blur-sm rounded-xl sm:rounded-2xl border-2 border-neutral-800 p-4 sm:p-6 md:p-8 text-center mt-8 sm:mt-10 md:mt-14">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 sm:h-16 w-12 sm:w-16 mx-auto text-amber-400 mb-2 sm:mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="text-xl sm:text-2xl font-semibold text-amber-300 mb-1 sm:mb-2">Work In Progress</h3>
                <p className="text-neutral-400 text-base sm:text-lg">No tasks completed yet.</p>
                <div className="mt-4 sm:mt-6 text-xs sm:text-sm text-neutral-500 flex items-center justify-center">
                  
                
                </div>
              </div>
            ) : (
              <>
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-emerald-400 mb-6 sm:mb-8 md:mb-10 mt-8 sm:mt-10 md:mt-11">Completed Tasks ({completed.length})</h1>
                <div className="space-y-4 sm:space-y-6 md:space-y-8">
                  {completed
                    .sort((a, b) => new Date(a.due) - new Date(b.due))
                    .map((task) => (
                      <div 
                        key={task.taskId}
                        className="bg-neutral-900/80 backdrop-blur-sm rounded-xl sm:rounded-2xl border-2 border-neutral-800 p-4 sm:p-6 md:p-8 w-full transition-all hover:border-emerald-500/30"
                      >
                        <div className="flex flex-col md:flex-row justify-between items-start gap-4 md:gap-6">
                          <div className="flex-1">
                            <div className="flex flex-wrap items-center gap-2 sm:gap-4 mb-3 sm:mb-4">
                              <span className="font-mono text-sm sm:text-base md:text-lg text-emerald-400 bg-emerald-900/20 px-3 py-1 sm:px-4 sm:py-1.5 rounded-full">
                                {task.taskId}
                              </span>
                              <span className="text-xs sm:text-sm font-medium px-2 py-1 sm:px-3 sm:py-1.5 rounded-full bg-emerald-900/50 text-emerald-300">
                                {task.status}
                              </span>
                            </div>
                            <h2 className="text-xl sm:text-2xl font-semibold text-white mb-2 sm:mb-4">{task.title}</h2>
                            <p className="text-neutral-300 text-base sm:text-lg mb-4 sm:mb-6 leading-relaxed">{task.description}</p>
                            
                          </div>
                          
                          <div className="flex flex-col items-end w-full md:w-auto md:min-w-[200px] mt-4 md:mt-0">
                            <div className="text-right">
                              <p className="text-xs sm:text-sm text-neutral-500 mb-1">Due Date</p>
                              <p className="text-base sm:text-lg font-medium text-white">
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

export default AdminEmpTasks;