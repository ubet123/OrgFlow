import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/themeContext';

const TasksTable = () => {
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [tasksPerPage] = useState(5);
  const navigate = useNavigate();
  const { theme } = useTheme();
  const API_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get(`${API_URL}/task/alltasks`, {
          withCredentials: true
        });
        setTasks(response.data.tasks);
        setFilteredTasks(response.data.tasks);
      } catch (error) {
        console.error('Error fetching tasks:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchTasks();
  }, []);

  // Search functionality
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredTasks(tasks);
    } else {
      const lowercasedSearch = searchTerm.toLowerCase();
      const filtered = tasks.filter(task => 
        task.taskId.toLowerCase().includes(lowercasedSearch) ||
        task.assigned.toLowerCase().includes(lowercasedSearch) ||
        task.title.toLowerCase().includes(lowercasedSearch) ||
        task.description.toLowerCase().includes(lowercasedSearch)
      );
      setFilteredTasks(filtered);
    }
    setCurrentPage(1); // Reset to first page when search changes
  }, [searchTerm, tasks]);

  // Sort tasks: Overdue -> Pending -> Completed
  const sortedTasks = [...filteredTasks].sort((a, b) => {
    const now = new Date();
    const aDue = new Date(a.due);
    const bDue = new Date(b.due);
    
    // Check if task is overdue (due date passed and status is Pending)
    const isAOverdue = aDue < now && a.status === 'Pending';
    const isBOverdue = bDue < now && b.status === 'Pending';
    
    // Priority 1: Overdue tasks first
    if (isAOverdue && !isBOverdue) return -1;
    if (!isAOverdue && isBOverdue) return 1;
    
    // If both are overdue, sort by due date (most overdue first)
    if (isAOverdue && isBOverdue) {
      return aDue - bDue;
    }
    
    // Priority 2: Pending tasks (not overdue)
    if (a.status === 'Pending' && b.status !== 'Pending') return -1;
    if (a.status !== 'Pending' && b.status === 'Pending') return 1;
    
    // If both are pending and not overdue, sort by due date (earliest first)
    if (a.status === 'Pending' && b.status === 'Pending') {
      return aDue - bDue;
    }
    
    // Priority 3: Completed tasks last
    // If both are completed, sort by due date (most recent due date first)
    if (a.status === 'Completed' && b.status === 'Completed') {
      return bDue - aDue;
    }
    
    return 0;
  });

  // Pagination logic
  const indexOfLastTask = currentPage * tasksPerPage;
  const indexOfFirstTask = indexOfLastTask - tasksPerPage;
  const currentTasks = sortedTasks.slice(indexOfFirstTask, indexOfLastTask);
  const totalPages = Math.ceil(sortedTasks.length / tasksPerPage);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const nextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };
  const prevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

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

  // Custom styles for theme
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

  const searchInputStyles = theme === 'dark'
    ? 'bg-neutral-800 border-neutral-700 text-neutral-300 placeholder-neutral-500'
    : 'bg-white border-neutral-300 text-neutral-800 placeholder-neutral-500';

  const paginationButtonStyles = theme === 'dark'
    ? 'bg-neutral-800 border-neutral-700 text-neutral-300 hover:bg-neutral-700'
    : 'bg-white border-neutral-300 text-neutral-700 hover:bg-neutral-100';

  const activePageStyles = theme === 'dark'
    ? 'bg-emerald-600 border-emerald-500 text-white'
    : 'bg-emerald-500 border-emerald-400 text-white';

  return (
    <div className={`mt-8 sm:mt-12 md:mt-16 lg:mt-20 xl:mt-32 backdrop-blur-sm rounded-lg sm:rounded-xl border overflow-hidden w-[95vw] sm:w-[90vw] md:w-[85vw] lg:w-[80vw] mx-auto ${containerStyles}`}>
      <div className="py-6 px-4 sm:py-8 sm:px-6 md:px-10 lg:px-16 xl:px-20">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6 gap-4">
          <h2 className={`text-xl sm:text-2xl font-bold ${accentColor}`}>Assigned Tasks</h2>
          
          {/* Search Bar */}
          <div className="w-full sm:w-64">
            <div className="relative">
              <input
                type="text"
                placeholder="Search tasks..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full px-4 py-2 pl-10 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors ${searchInputStyles}`}
              />
              <svg 
                className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
                />
              </svg>
            </div>
          </div>
        </div>
        
        {loading ? (
          <div className="flex justify-center py-8">
            <div className={`animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-t-2 border-b-2 ${theme === 'dark' ? 'border-emerald-500' : 'border-emerald-600'}`}></div>
          </div>
        ) : sortedTasks.length === 0 ? (
          <div className={`rounded-lg p-8 text-center ${theme === 'dark' ? 'bg-neutral-800/50' : 'bg-neutral-200/50'}`}>
            <p className={textColor}>
              {searchTerm ? 'No tasks found matching your search' : 'No tasks found'}
            </p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              {/* Desktop Screen Responsive Table - Keep original sizes */}
              <table className="w-full border-collapse hidden sm:table">
                <thead>
                  <tr className={`border-b ${tableBorderColor}`}>
                    <th className={`px-4 py-3 sm:px-6 sm:py-4 text-left text-sm sm:text-lg font-medium ${tableHeaderColor}`}>Task ID</th>
                    <th className={`px-4 py-3 sm:px-6 sm:py-4 text-left text-sm sm:text-lg font-medium ${tableHeaderColor}`}>Title</th>
                    <th className={`px-4 py-3 sm:px-6 sm:py-4 text-left text-sm sm:text-lg font-medium ${tableHeaderColor}`}>Assigned To</th>
                    <th className={`px-4 py-3 sm:px-6 sm:py-4 text-left text-sm sm:text-lg font-medium ${tableHeaderColor}`}>Description</th>
                    <th className={`px-4 py-3 sm:px-6 sm:py-4 text-left text-sm sm:text-lg font-medium ${tableHeaderColor}`}>Due Date</th>
                    <th className={`px-4 py-3 sm:px-6 sm:py-4 text-left text-sm sm:text-lg font-medium ${tableHeaderColor}`}>Task Status</th>
                  </tr>
                </thead>
                <tbody className={`divide-y ${theme === 'dark' ? 'divide-neutral-800' : 'divide-neutral-300'}`}>
                  {currentTasks.map((task) => (
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
                      <td className={`px-4  py-3 sm:px-6 sm:py-4 text-sm sm:text-base ${textColor}`}>
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

              {/* Mobile Responsive View Cards - More Compact but same font sizes */}
              <div className="sm:hidden space-y-3">
                {currentTasks.map((task) => (
                  <div 
                    key={task.taskId} 
                    className={`
                      ${(task.status === 'Pending') && (new Date() > new Date(task.due)) ? overdueStyles : cardStyles}
                      rounded-lg p-3 border
                      ${theme === 'dark' ? 'border-neutral-700' : 'border-neutral-300'}
                      w-full max-w-full overflow-hidden
                    `}
                  >
                    <div className="flex justify-between items-start gap-2">
                      <div className="flex-1 min-w-0">
                        <h3 className={`${accentColor} font-medium text-sm truncate`}>{task.title}</h3>
                        <p className={`text-xs mt-1 ${theme === 'dark' ? 'text-neutral-400' : 'text-neutral-600'} font-mono truncate`}>
                          ID: {task.taskId}
                        </p>
                      </div>
                      <span
                        onClick={() => navigate(`/manager-dashboard/employee-tasks/${encodeURIComponent(task.assigned)}`)}
                        className={`${employeeBadgeStyles} px-2 py-1 rounded-md text-xs font-bold hover:cursor-pointer flex-shrink-0 max-w-20 truncate`}
                        title={task.assigned}
                      >
                        {task.assigned}
                      </span>
                    </div>
                    
                    <div className="mt-2">
                      <p className={`text-sm ${theme === 'dark' ? 'text-neutral-300' : 'text-neutral-700'} break-words line-clamp-2 max-h-10 overflow-hidden`}>
                        {task.description}
                      </p>
                    </div>
                    
                    <div className='flex justify-between items-center mt-2 gap-2'>
                      <div className="flex justify-start gap-2 items-center flex-1 min-w-0">
                        <span className={`text-xs ${theme === 'dark' ? 'text-neutral-500' : 'text-neutral-600'} flex-shrink-0`}>
                          Due Date:
                        </span>
                        <span className={`text-xs ${theme === 'dark' ? 'text-neutral-300' : 'text-neutral-800'} truncate`}>
                          {formatDate(task.due)}
                        </span>
                      </div>
                      <div className='flex-shrink-0'>
                        {task.status === 'Completed' ? (
                          <div className={`text-sm font-bold ${theme === 'dark' ? 'text-green-300' : 'text-green-600'}`}>
                            {task.status}
                          </div>
                        ) : (
                          <div className={`text-sm font-bold ${theme === 'dark' ? 'text-yellow-300' : 'text-yellow-600'}`}>
                            {task.status}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Pagination Controls - Mobile Optimized but same functionality */}
            {totalPages > 1 && (
              <div className="flex flex-col sm:flex-row items-center justify-between mt-6 pt-4 border-t border-neutral-700 gap-4">
                <div className={`text-sm ${textColor}`}>
                  Showing {indexOfFirstTask + 1}-{Math.min(indexOfLastTask, sortedTasks.length)} of {sortedTasks.length} tasks
                </div>
                
                <div className="flex items-center space-x-2">
                  {/* Previous Button */}
                  <button
                    onClick={prevPage}
                    disabled={currentPage === 1}
                    className={`px-3 py-2 rounded-lg border text-sm font-medium transition-colors ${
                      currentPage === 1 
                        ? 'opacity-50 cursor-not-allowed' 
                        : `${paginationButtonStyles} hover:scale-105`
                    }`}
                  >
                    Previous
                  </button>

                  {/* Page Numbers */}
                  <div className="flex space-x-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
                      <button
                        key={number}
                        onClick={() => paginate(number)}
                        className={`w-8 h-8 rounded-lg border text-sm font-medium transition-colors ${
                          currentPage === number 
                            ? activePageStyles 
                            : paginationButtonStyles
                        } hover:scale-105`}
                      >
                        {number}
                      </button>
                    ))}
                  </div>

                  {/* Next Button */}
                  <button
                    onClick={nextPage}
                    disabled={currentPage === totalPages}
                    className={`px-3 py-2 rounded-lg border text-sm font-medium transition-colors ${
                      currentPage === totalPages 
                        ? 'opacity-50 cursor-not-allowed' 
                        : `${paginationButtonStyles} hover:scale-105`
                    }`}
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default TasksTable;