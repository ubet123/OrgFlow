import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/themeContext';

const TasksTable = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { theme } = useTheme();

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get('http://localhost:3001/task/alltasks', {
          withCredentials: true
        });
        setTasks(response.data.tasks);
      } catch (error) {
        console.error('Error fetching tasks:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchTasks();
  }, []);

  // Format date function
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return isNaN(date.getTime()) 
      ? 'Invalid date' 
      : date.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        });
  };

  // Theme-based styles
  const containerStyles = theme === 'dark' 
    ? 'bg-neutral-900/80 border-neutral-800' 
    : 'bg-neutral-100/80 border-neutral-300';
  
  const textColor = theme === 'dark' ? 'text-neutral-300' : 'text-neutral-800';
  const accentColor = theme === 'dark' ? 'text-emerald-400' : 'text-emerald-600';
  const tableHeaderColor = theme === 'dark' ? 'text-neutral-300' : 'text-neutral-700';
  const tableBorderColor = theme === 'dark' ? 'border-neutral-700' : 'border-neutral-300';
  const tableRowHover = theme === 'dark' ? 'hover:bg-neutral-800/50' : 'hover:bg-neutral-200/50';
  
  const cardStyles = theme === 'dark' 
    ? 'bg-neutral-800/50 border-neutral-700' 
    : 'bg-white border-neutral-300';
  
  const overdueStyles = theme === 'dark' 
    ? 'bg-red-950' 
    : 'bg-red-300';
  
  const employeeBadgeStyles = theme === 'dark' 
    ? 'bg-emerald-900/30 hover:bg-emerald-800 text-emerald-300' 
    : 'bg-emerald-200 hover:bg-emerald-300 text-emerald-700';
  
  const scrollbarStyles = theme === 'dark' 
    ? 'custom-scrollbar' 
    : 'custom-scrollbar-light';

  return (
    <div className={`mt-8 sm:mt-12 md:mt-16 lg:mt-20 xl:mt-32 backdrop-blur-sm rounded-lg sm:rounded-xl border overflow-hidden w-[95vw] sm:w-[90vw] md:w-[85vw] lg:w-[80vw] mx-auto ${containerStyles}`}>
      <div className="py-6 px-4 sm:py-8 sm:px-6 md:px-10 lg:px-16 xl:px-20">
        <h2 className={`text-xl sm:text-2xl font-bold ${accentColor} mb-4 sm:mb-6`}>Assigned Tasks</h2>
        
        {loading ? (
          <div className="flex justify-center py-8">
            <div className={`animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-t-2 border-b-2 ${theme === 'dark' ? 'border-emerald-500' : 'border-emerald-600'}`}></div>
          </div>
        ) : tasks.length === 0 ? (
          <div className={`rounded-lg p-8 text-center ${theme === 'dark' ? 'bg-neutral-800/50' : 'bg-neutral-200/50'}`}>
            <p className={textColor}>No tasks found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            {/* Desktop Table */}
            <table className="w-full border-collapse hidden sm:table">
              <thead>
                <tr className={`border-b ${tableBorderColor}`}>
                  <th className={`px-4 py-3 sm:px-6 sm:py-4 text-left min-w-32 text-sm sm:text-lg font-medium ${tableHeaderColor}`}>Task ID</th>
                  <th className={`px-4 py-3 sm:px-6 sm:py-4 text-left text-sm sm:text-lg font-medium ${tableHeaderColor}`}>Title</th>
                  <th className={`px-4 py-3 sm:px-6 sm:py-4 text-left text-sm sm:text-lg font-medium ${tableHeaderColor}`}>Assigned To</th>
                  <th className={`px-4 py-3 sm:px-6 sm:py-4 text-left text-sm sm:text-lg font-medium ${tableHeaderColor}`}>Description</th>
                  <th className={`px-4 py-3 sm:px-6 sm:py-4 text-left text-sm sm:text-lg font-medium ${tableHeaderColor}`}>Due Date</th>
                  <th className={`px-4 py-3 sm:px-6 sm:py-4 text-left text-sm sm:text-lg font-medium ${tableHeaderColor}`}>Task Status</th>
                </tr>
              </thead>
              <tbody className={`divide-y ${theme === 'dark' ? 'divide-neutral-800' : 'divide-neutral-300'}`}>
                {tasks.map((task) => (
                  <tr 
                    key={task.taskId} 
                    className={`
                      ${(new Date(task.due) < new Date()) && (task.status === 'Pending') ? overdueStyles : ''} 
                      ${tableRowHover}
                      transition-colors
                      first:rounded-lg last:rounded-lg
                      my-3
                    `}
                  >
                    <td className={`px-4 py-3 sm:px-6 sm:py-4 text-sm sm:text-base font-mono first:rounded-tl-lg last:rounded-bl-lg ${textColor}`}>
                      {task.taskId}
                    </td>
                    <td className={`px-4 py-3 sm:px-6 sm:py-4 text-sm sm:text-base ${textColor}`}>
                      {task.title}
                    </td>
                    <td className={`px-4 py-3 sm:px-6 sm:py-4 text-sm sm:text-base ${textColor}`}>
                      <div className="flex items-center space-x-2">
                        <span
                          onClick={() => navigate(`/manager-dashboard/employee-tasks/${encodeURIComponent(task.assigned)}`)}
                          className={`${employeeBadgeStyles} hover:cursor-pointer font-bold px-2 py-1 sm:px-3 sm:py-1.5 rounded-lg text-xs sm:text-sm`}
                        >
                          {task.assigned}
                        </span>
                      </div>
                    </td>
                    <td className={`px-4 py-3 sm:px-6 sm:py-4`}>
                      <div className={`text-sm sm:text-base max-h-24 overflow-y-auto pr-2 ${scrollbarStyles} ${theme === 'dark' ? 'text-neutral-400' : 'text-neutral-600'}`}>
                        {task.description}
                      </div>
                    </td>
                    <td className={`px-4 py-3 sm:px-6 sm:py-4 text-sm min-w-28 sm:text-base ${theme === 'dark' ? 'text-neutral-400' : 'text-neutral-600'}`}>
                      {formatDate(task.due)}
                    </td>
                    
                    {task.status === 'Completed' ? (
                      <td className={`px-4 py-3 sm:px-6 sm:py-4 text-sm sm:text-lg font-semibold text-green-600 last:rounded-tr-lg last:rounded-br-lg ${theme === 'dark' ? 'text-green-300' : 'text-green-600'}`}>
                        {task.status}
                      </td>
                    ) : (
                      <td className={`px-4 py-3 sm:px-6 sm:py-4 text-sm sm:text-lg font-semibold  text-yellow-600 last:rounded-tr-lg last:rounded-br-lg ${theme === 'dark' ? 'text-yellow-300' : 'text-yellow-600'}`}>
                        {task.status}
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Mobile Cards */}
            <div className="sm:hidden space-y-4">
              {tasks.map((task) => (
                <div 
                  key={task.taskId} 
                  className={`
                    ${(task.status === 'Pending') && (new Date() > new Date(task.due)) ? overdueStyles : cardStyles}
                    rounded-lg p-4 border
                    ${theme === 'dark' ? 'border-neutral-700' : 'border-neutral-300'}
                  `}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className={`${accentColor} font-medium`}>{task.title}</h3>
                      <p className={`text-xs mt-1 ${theme === 'dark' ? 'text-neutral-400' : 'text-neutral-600'} font-mono`}>
                        ID: {task.taskId}
                      </p>
                    </div>
                    <span
                      onClick={() => navigate(`/manager-dashboard/employee-tasks/${encodeURIComponent(task.assigned)}`)}
                      className={`${employeeBadgeStyles} px-2 py-1 rounded-md text-xs`}
                    >
                      {task.assigned}
                    </span>
                  </div>
                  
                  <div className="mt-3">
                    <p className={`text-sm line-clamp-3 ${theme === 'dark' ? 'text-neutral-300' : 'text-neutral-700'}`}>
                      {task.description}
                    </p>
                  </div>
                  
                  <div className='flex justify-between items-center mt-3'>
                    <div className="flex justify-start gap-2 items-center">
                      <span className={`text-xs ${theme === 'dark' ? 'text-neutral-500' : 'text-neutral-600'}`}>
                        Due Date:
                      </span>
                      <span className={`text-xs ${theme === 'dark' ? 'text-neutral-300' : 'text-neutral-800'}`}>
                        {formatDate(task.due)}
                      </span>
                    </div>
                    <div className='pt-2'>
                      {task.status === 'Completed' ? (
                        <div className={`text-base font-bold ${theme === 'dark' ? 'text-green-300' : 'text-green-600'}`}>
                          {task.status}
                        </div>
                      ) : (
                        <div className={`text-base font-bold ${theme === 'dark' ? 'text-yellow-300' : 'text-yellow-600'}`}>
                          {task.status}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TasksTable;