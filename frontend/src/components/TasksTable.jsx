import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/themeContext';
import { MdEdit } from "react-icons/md";
import { MdDelete } from "react-icons/md";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import EditTaskForm from './EditTaskForm';

const TasksTable = () => {
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [tasksPerPage] = useState(5);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [employees, setEmployees] = useState([]);
  const [showEditForm, setShowEditForm] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
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
        toast.error('Failed to fetch tasks');
      } finally {
        setLoading(false);
      }
    };
    
    const fetchEmployees = async () => {
      try {
        const response = await axios.get(`${API_URL}/user/employees`, {
          withCredentials: true
        });
        if (response.data.users) {
          setEmployees(response.data.users);
        } else if (response.data.employees) {
          setEmployees(response.data.employees);
        } else {
          setEmployees([]);
        }
      } catch (error) {
        console.error('Error fetching employees:', error);
        toast.error('Failed to fetch employees');
      }
    };
    
    fetchTasks();
    fetchEmployees();
  }, []);

  const handleEdit = (task) => {
    setSelectedTask(task);
    setShowEditForm(true);
  };

  const handleCloseEditForm = () => {
    setShowEditForm(false);
    setSelectedTask(null);
  };

  const handleTaskUpdated = (updatedTask) => {
    const updatedTasks = tasks.map(task => 
      task.taskId === updatedTask.taskId ? updatedTask : task
    );
    setTasks(updatedTasks);
    setFilteredTasks(updatedTasks);
  };

  const handleDeleteClick = (taskId) => {
    const task = tasks.find(t => t.taskId === taskId);
    if (task) {
      setTaskToDelete(task);
      setShowDeleteConfirm(true);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!taskToDelete) return;
    
    setDeleting(true);
    
    try {
      const response = await axios.delete(
        `${API_URL}/task/deleteTask/${taskToDelete.taskId}`,
        { withCredentials: true }
      );
      
      const updatedTasks = tasks.filter(task => task._id !== taskToDelete._id);
      setTasks(updatedTasks);
      setFilteredTasks(updatedTasks);
      
      setShowDeleteConfirm(false);
      setTaskToDelete(null);
      
      toast.success(response.data.message || 'Task deleted successfully!');
      
    } catch (error) {
      console.error('Error deleting task:', error);
      toast.error(error.response?.data?.message || 'Failed to delete task');
    } finally {
      setDeleting(false);
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteConfirm(false);
    setTaskToDelete(null);
    setDeleting(false);
  };

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
    setCurrentPage(1);
  }, [searchTerm, tasks]);

  const sortedTasks = [...filteredTasks].sort((a, b) => {
    const now = new Date();
    const aDue = new Date(a.due);
    const bDue = new Date(b.due);
    
    const isAOverdue = aDue < now && a.status === 'Pending';
    const isBOverdue = bDue < now && b.status === 'Pending';
    
    if (isAOverdue && !isBOverdue) return -1;
    if (!isAOverdue && isBOverdue) return 1;
    
    if (isAOverdue && isBOverdue) {
      return aDue - bDue;
    }
    
    if (a.status === 'Pending' && b.status !== 'Pending') return -1;
    if (a.status !== 'Pending' && b.status === 'Pending') return 1;
    
    if (a.status === 'Pending' && b.status === 'Pending') {
      return aDue - bDue;
    }
    
    if (a.status === 'Completed' && b.status === 'Completed') {
      return bDue - aDue;
    }
    
    return 0;
  });

  const indexOfLastTask = currentPage * tasksPerPage;
  const indexOfFirstTask = indexOfLastTask - tasksPerPage;
  const currentTasks = sortedTasks.slice(indexOfFirstTask, indexOfLastTask);
  const totalPages = Math.ceil(sortedTasks.length / tasksPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const nextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };
  const prevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

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

  const editButtonStyles = theme === 'dark'
    ? 'bg-blue-900/30 hover:bg-blue-800 text-blue-300'
    : 'bg-blue-200 hover:bg-blue-300 text-blue-700';

  const deleteButtonStyles = theme === 'dark'
    ? 'bg-red-600/30 hover:bg-red-800 text-red-300'
    : 'bg-red-200 hover:bg-red-300 text-red-700';

  const modalStyles = theme === 'dark' 
    ? 'bg-neutral-900/90 border-neutral-800' 
    : 'bg-white border-neutral-300';

  return (
    <>
      <div className={`mt-8 sm:mt-12 md:mt-16 lg:mt-20 xl:mt-32 backdrop-blur-sm rounded-lg sm:rounded-xl border overflow-hidden w-full max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 ${containerStyles}`}>
        <div className="py-6 px-3 sm:py-8 sm:px-4 md:px-6 lg:px-10 xl:px-12">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6 gap-4">
            <h2 className={`text-xl sm:text-2xl font-bold ${accentColor}`}>Assigned Tasks</h2>
            
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
                <table className="w-full table-fixed border-collapse hidden sm:table">
                  <colgroup>
                    <col className="w-[10%]" />
                    <col className="w-[15%]" />
                    <col className="w-[14%]" />
                    <col className="w-[22%]" />
                    <col className="w-[12%]" />
                    <col className="w-[11%]" />
                    <col className="w-[16%]" />
                  </colgroup>
                  <thead>
                    <tr className={`border-b ${tableBorderColor}`}>
                      <th className={`px-4 py-5 sm:px-6 sm:py-6 lg:px-8 text-left text-sm sm:text-lg font-medium ${tableHeaderColor}`}>Task ID</th>
                      <th className={`px-4 py-5 sm:px-6 sm:py-6 lg:px-8 text-left text-sm sm:text-lg font-medium ${tableHeaderColor}`}>Title</th>
                      <th className={`px-4 py-5 sm:px-6 sm:py-6 lg:px-8 text-left text-sm sm:text-lg font-medium ${tableHeaderColor}`}>Assigned To</th>
                      <th className={`px-4 py-5 sm:px-6 sm:py-6 lg:px-8 text-left text-sm sm:text-lg font-medium ${tableHeaderColor}`}>Description</th>
                      <th className={`px-4 py-5 sm:px-6 sm:py-6 lg:px-8 text-left text-sm sm:text-lg font-medium ${tableHeaderColor}`}>Due Date</th>
                      <th className={`px-4 py-5 sm:px-6 sm:py-6 lg:px-8 text-left text-sm sm:text-lg font-medium ${tableHeaderColor}`}>Task Status</th>
                      <th className={`px-4 py-5 sm:px-6 sm:py-6 lg:px-8 text-left text-sm sm:text-lg font-medium ${tableHeaderColor}`}>Actions</th>
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
                        `}
                      >
                        <td className={`px-4 py-5 sm:px-6 sm:py-6 lg:px-8 text-sm sm:text-base font-mono ${textColor}`}>
                          {task.taskId}
                        </td>
                        <td className={`px-4 py-5 sm:px-6 sm:py-6 lg:px-8 text-sm sm:text-base ${textColor}`}>
                          <span className="block truncate">
                            {task.title}
                          </span>
                        </td>
                        <td className={`px-4 py-5 sm:px-6 sm:py-6 lg:px-8 text-sm sm:text-base ${textColor}`}>
                          <div className="flex items-center space-x-2">
                            <span
                              onClick={() => navigate(`/manager-dashboard/employee-tasks/${encodeURIComponent(task.assigned)}`)}
                              className={`${employeeBadgeStyles} hover:cursor-pointer font-bold px-2 py-1 sm:px-3 sm:py-1.5 rounded-lg text-xs sm:text-sm whitespace-normal break-words`}
                            >
                              {task.assigned}
                            </span>
                          </div>
                        </td>
                        <td className={`px-4 py-5 sm:px-6 sm:py-6 lg:px-8`}>
                          <div className={`text-sm sm:text-base line-clamp-2 ${theme === 'dark' ? 'text-neutral-400' : 'text-neutral-600'}`}>
                            {task.description}
                          </div>
                        </td>
                        <td className={`px-4 py-5 sm:px-6 sm:py-6 lg:px-8 text-sm sm:text-base ${theme === 'dark' ? 'text-neutral-400' : 'text-neutral-600'}`}>
                          {formatDate(task.due)}
                        </td>
                        
                        {task.status === 'Completed' ? (
                          <td className={`px-4 py-5 sm:px-6 sm:py-6 lg:px-8 text-sm sm:text-lg font-semibold text-green-600 ${theme === 'dark' ? 'text-green-300' : 'text-green-600'}`}>
                            {task.status}
                          </td>
                        ) : (
                          <td className={`px-4 py-5 sm:px-6 sm:py-6 lg:px-8 text-sm sm:text-lg font-semibold text-yellow-600 ${theme === 'dark' ? 'text-yellow-300' : 'text-yellow-600'}`}>
                            {task.status}
                          </td>
                        )}
                        
                        <td className={`px-4 py-5 sm:px-6 sm:py-6 lg:px-8`}>
                          <div className="flex flex-wrap gap-2">
                            <button
                              onClick={() => handleEdit(task)}
                              className={`w-24 px-3 py-1 rounded text-sm font-medium ${editButtonStyles}`}
                            >
                              <div className='flex flex-row items-center justify-center gap-2'>
                                <MdEdit /> Edit
                              </div>
                            </button>
                            <button
                              onClick={() => handleDeleteClick(task.taskId)}
                              className={`w-24 px-3 py-1 rounded text-sm font-medium ${deleteButtonStyles}`}
                            >
                            <div className='flex flex-row items-center justify-around gap-1'>
                                <MdDelete /> Delete
                              </div>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

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
                            Due:
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
                      
                      <div className="flex space-x-2 mt-3 pt-3 border-t border-neutral-700">
                        <button
                          onClick={() => handleEdit(task)}
                          className={`flex-1 px-2 py-1.5 rounded text-xs font-medium ${editButtonStyles}`}
                        >
                          <div className='flex flex-row items-center justify-center gap-1 '>
                            <MdEdit /> Edit
                          </div>
                        </button>
                        <button
                          onClick={() => handleDeleteClick(task.taskId)}
                          className={`flex-1 px-2 py-1.5 rounded text-xs font-medium ${deleteButtonStyles}`}
                        >
                          <div className='flex flex-row items-center justify-center gap-1'>
                            <MdDelete /> Delete
                          </div>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {totalPages > 1 && (
                <div className="flex flex-col sm:flex-row items-center justify-between mt-6 pt-4 border-t border-neutral-700 gap-4">
                  <div className={`text-sm ${textColor}`}>
                    Showing {indexOfFirstTask + 1}-{Math.min(indexOfLastTask, sortedTasks.length)} of {sortedTasks.length} tasks
                  </div>
                  
                  <div className="flex items-center space-x-2">
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

      {showEditForm && selectedTask && (
        <EditTaskForm
          task={selectedTask}
          employees={employees}
          onClose={handleCloseEditForm}
          onTaskUpdated={handleTaskUpdated}
        />
      )}

      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className={`backdrop-blur-sm rounded-xl border p-4 sm:p-6 w-full max-w-md ${modalStyles}`}>
            <div className="flex items-start mb-4">
              <div className="bg-red-900/30 p-2 rounded-lg mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div>
                <h3 className={`text-lg font-semibold mb-1 ${textColor}`}>Delete Task</h3>
                <p className={`text-sm sm:text-base ${textColor}`}>
                  Are you sure you want to permanently delete task <span className={`font-medium ${accentColor}`}>"{taskToDelete?.title}"</span>?
                </p>
                <p className={`text-sm ${theme === 'dark' ? 'text-neutral-400' : 'text-neutral-600'} mt-1`}>
                  Task ID: <span className="font-mono">{taskToDelete?.taskId}</span>
                </p>
                <p className={`text-sm text-amber-500 mt-2 ${theme === 'dark' ? 'text-amber-400' : 'text-amber-600'}`}>
                  Note: This action cannot be undone.
                </p>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 mt-4 sm:mt-6">
              <button
                onClick={handleDeleteCancel}
                disabled={deleting}
                className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg border transition-colors text-sm sm:text-base ${
                  theme === 'dark' ? 'border-neutral-700 text-neutral-300 hover:bg-neutral-800' : 'border-neutral-300 text-neutral-700 hover:bg-neutral-100'
                } ${deleting ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                disabled={deleting}
                className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg bg-red-800 hover:bg-red-700 text-white transition-colors flex items-center justify-center text-sm sm:text-base disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {deleting ? (
                  <>
                    <div className={`animate-spin rounded-full h-4 w-4 sm:h-5 sm:w-5 border-t-2 border-b-2 border-white mr-2`}></div>
                    Deleting...
                  </>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Delete
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default TasksTable;