import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/themeContext';
import { MdEdit } from "react-icons/md";
import { MdDelete } from "react-icons/md";
import toast from 'react-hot-toast';
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
  const [statusFilter, setStatusFilter] = useState('All');
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
    let filtered = tasks;

    if (statusFilter !== 'All') {
      filtered = filtered.filter(task => task.status === statusFilter);
    }

    if (searchTerm.trim() !== '') {
      const lowercasedSearch = searchTerm.toLowerCase();
      filtered = filtered.filter(task => 
        task.taskId.toLowerCase().includes(lowercasedSearch) ||
        task.assigned.toLowerCase().includes(lowercasedSearch) ||
        task.title.toLowerCase().includes(lowercasedSearch) ||
        task.description.toLowerCase().includes(lowercasedSearch)
      );
    }

    setFilteredTasks(filtered);
    setCurrentPage(1);
  }, [searchTerm, statusFilter, tasks]);

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
    ? 'glass-card-dark shadow-[0_4px_24px_rgba(0,0,0,0.2)]' 
    : 'glass-card-light shadow-[0_2px_16px_rgba(0,0,0,0.03)]';
  
  const textColor = theme === 'dark' ? 'text-neutral-200' : 'text-neutral-800';
  const accentColor = theme === 'dark' ? 'text-emerald-400' : 'text-emerald-600';
  const tableHeaderColor = theme === 'dark' ? 'text-neutral-500 font-semibold' : 'text-neutral-400 font-semibold';
  const tableBorderColor = theme === 'dark' ? 'border-neutral-800/40' : 'border-neutral-200/40';
  const tableRowHover = theme === 'dark' ? 'hover:bg-neutral-800/20' : 'hover:bg-neutral-50/60';
  
  const cardStyles = theme === 'dark' 
    ? 'bg-neutral-900/30 border-neutral-800/40' 
    : 'bg-white/50 border-neutral-200/40';
  
  const overdueStyles = theme === 'dark' 
    ? 'bg-red-950/10 border-l-2 border-l-red-500/40 text-red-300' 
    : 'bg-red-50/30 border-l-2 border-l-red-400/40 text-red-800';
  
  const employeeBadgeStyles = theme === 'dark' 
    ? 'bg-emerald-500/10 hover:bg-emerald-500/15 text-emerald-400 border border-emerald-500/15' 
    : 'bg-emerald-50/80 hover:bg-emerald-100/60 text-emerald-700 border border-emerald-200/40';
  
  const scrollbarStyles = theme === 'dark' 
    ? 'custom-scrollbar' 
    : 'custom-scrollbar-light';

  const searchInputStyles = theme === 'dark'
    ? 'bg-neutral-900/50 border-neutral-800/50 text-neutral-200 placeholder-neutral-600 focus:border-emerald-500/50 focus:ring-emerald-500/10'
    : 'bg-white/60 border-neutral-200/50 text-neutral-800 placeholder-neutral-400 focus:border-emerald-500/50 focus:ring-emerald-500/10';

  const paginationButtonStyles = theme === 'dark'
    ? 'bg-neutral-900/50 border-neutral-800/40 text-neutral-400 hover:bg-neutral-800/50 hover:text-neutral-200'
    : 'bg-white/60 border-neutral-200/40 text-neutral-500 hover:bg-neutral-50/80 hover:text-neutral-800';

  const activePageStyles = theme === 'dark'
    ? 'bg-emerald-500/20 border-emerald-500/30 text-emerald-400'
    : 'bg-emerald-50 border-emerald-200/50 text-emerald-700';

  const editButtonStyles = theme === 'dark'
    ? 'bg-blue-500/10 hover:bg-blue-500/15 text-blue-400 border border-blue-500/15 active:scale-95'
    : 'bg-blue-50/80 hover:bg-blue-100/60 text-blue-600 border border-blue-200/40 active:scale-95';

  const deleteButtonStyles = theme === 'dark'
    ? 'bg-red-500/10 hover:bg-red-500/15 text-red-400 border border-red-500/15 active:scale-95'
    : 'bg-red-50/80 hover:bg-red-100/60 text-red-600 border border-red-200/40 active:scale-95';

  const modalStyles = theme === 'dark' 
    ? 'bg-neutral-950/95 border-neutral-800/60 shadow-[0_10px_40px_rgba(0,0,0,0.6)] backdrop-blur-xl' 
    : 'bg-white/95 border-neutral-200/60 shadow-[0_10px_40px_rgba(0,0,0,0.08)] backdrop-blur-xl';

  return (
    <>
      <div className={`rounded-2xl overflow-hidden w-full max-w-[1400px] mx-auto transition-all duration-300 animate-fade-in-up accent-top ${containerStyles}`}>
        <div className="py-6 px-4 sm:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 pb-5 border-b border-neutral-500/10 gap-4">
            <h2 className={`text-xl sm:text-2xl font-bold tracking-tight ${accentColor}`}>Assigned Tasks</h2>
            
            <div className="flex flex-col sm:flex-row gap-2.5 w-full sm:w-auto">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className={`px-3.5 py-2 rounded-xl border text-sm focus:outline-none focus:ring-4 transition-all duration-300 cursor-pointer ${searchInputStyles}`}
              >
                <option value="All">All Tasks</option>
                <option value="Pending">Pending</option>
                <option value="Completed">Completed</option>
              </select>

              <div className="relative w-full sm:w-64">
                <input
                  type="text"
                  placeholder="Search tasks..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={`w-full px-4 py-2 pl-10 rounded-xl border text-sm focus:outline-none focus:ring-4 transition-all duration-300 ${searchInputStyles}`}
                />
                <svg 
                  className={`absolute left-3.5 top-1/2 transform -translate-y-1/2 w-4 h-4 ${theme === 'dark' ? 'text-neutral-600' : 'text-neutral-400'}`}
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={1.5} 
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
                  />
                </svg>
              </div>
            </div>
          </div>
          
          {loading ? (
            <div className="flex justify-center py-12">
              <div className={`animate-spin rounded-full h-8 w-8 border-2 border-t-transparent ${theme === 'dark' ? 'border-emerald-500' : 'border-emerald-600'}`}></div>
            </div>
          ) : sortedTasks.length === 0 ? (
            <div className={`rounded-2xl p-10 text-center border border-dashed ${theme === 'dark' ? 'border-neutral-800/40 text-neutral-500' : 'border-neutral-200/40 text-neutral-400'}`}>
              <p className="text-sm font-medium">
                {searchTerm ? 'No tasks found matching your search' : 'No tasks assigned yet'}
              </p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full table-fixed border-collapse hidden sm:table">
                  <colgroup>
                    <col className="w-[10%]" />
                    <col className="w-[18%]" />
                    <col className="w-[13%]" />
                    <col className="w-[21%]" />
                    <col className="w-[11%]" />
                    <col className="w-[12%]" />
                    <col className="w-[15%]" />
                  </colgroup>
                  <thead>
                    <tr className={`border-b ${tableBorderColor}`}>
                      <th className={`px-2 xl:px-3 py-3.5 text-left text-[11px] uppercase tracking-widest ${tableHeaderColor}`}>Task ID</th>
                      <th className={`px-2 xl:px-3 py-3.5 text-left text-[11px] uppercase tracking-widest ${tableHeaderColor}`}>Title</th>
                      <th className={`px-2 xl:px-3 py-3.5 text-left text-[11px] uppercase tracking-widest ${tableHeaderColor}`}>Assigned To</th>
                      <th className={`px-2 xl:px-3 py-3.5 text-left text-[11px] uppercase tracking-widest ${tableHeaderColor}`}>Description</th>
                      <th className={`px-2 xl:px-3 py-3.5 text-left text-[11px] uppercase tracking-widest ${tableHeaderColor}`}>Due Date</th>
                      <th className={`px-2 xl:px-3 py-3.5 text-left text-[11px] uppercase tracking-widest ${tableHeaderColor}`}>Status</th>
                      <th className={`px-2 xl:px-3 py-3.5 text-left text-[11px] uppercase tracking-widest ${tableHeaderColor}`}>Actions</th>
                    </tr>
                  </thead>
                  <tbody className={`divide-y ${theme === 'dark' ? 'divide-neutral-800/30' : 'divide-neutral-100/60'}`}>
                    {currentTasks.map((task) => {
                      const isOverdue = (new Date(task.due) < new Date()) && (task.status === 'Pending');
                      return (
                        <tr 
                          key={task.taskId} 
                          className={`
                            ${isOverdue ? overdueStyles : ''} 
                            ${tableRowHover}
                            transition-all duration-200
                          `}
                        >
                          <td className="px-2 xl:px-3 py-4 text-sm font-mono">
                            <button
                              type="button"
                              onClick={() => navigate(`/task/${encodeURIComponent(task.taskId)}`)}
                              className={`rounded-lg px-2 py-1 font-semibold text-xs border transition-all duration-200 ${
                                theme === 'dark' 
                                  ? 'bg-emerald-500/10 border-emerald-500/15 text-emerald-400 hover:bg-emerald-500/15' 
                                  : 'bg-emerald-50/80 border-emerald-200/40 text-emerald-700 hover:bg-emerald-100/60'
                              }`}
                            >
                              {task.taskId}
                            </button>
                          </td>
                          <td className={`px-2 xl:px-3 py-4 text-sm font-medium ${textColor}`}>
                            <span className="block truncate" title={task.title}>
                              {task.title}
                            </span>
                          </td>
                          <td className="px-2 xl:px-3 py-4 text-sm">
                            <div className="flex items-center">
                              <span
                                onClick={() => navigate(`/manager-dashboard/employee-tasks/${encodeURIComponent(task.assigned)}`)}
                                className={`${employeeBadgeStyles} hover:cursor-pointer font-semibold rounded-lg text-xs flex items-center justify-center text-center w-full px-1.5 py-1.5 truncate transition-all duration-200`}
                                title={task.assigned}
                              >
                                {task.assigned}
                              </span>
                            </div>
                          </td>
                          <td className="px-2 xl:px-3 py-4">
                            <div className={`text-sm truncate ${theme === 'dark' ? 'text-neutral-500' : 'text-neutral-500'}`} title={task.description}>
                              {task.description}
                            </div>
                          </td>
                          <td className={`px-2 xl:px-3 py-4 text-sm ${theme === 'dark' ? 'text-neutral-500' : 'text-neutral-500'}`}>
                            {formatDate(task.due)}
                          </td>
                          <td className="px-2 xl:px-3 py-4">
                            {task.status === 'Completed' ? (
                              <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold ${
                                theme === 'dark' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/15' : 'bg-emerald-50/80 text-emerald-700 border border-emerald-200/40'
                              }`}>
                                Completed
                              </span>
                            ) : (
                              <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold ${
                                theme === 'dark' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/15' : 'bg-amber-50/80 text-amber-700 border border-amber-200/40'
                              }`}>
                                Pending
                              </span>
                            )}
                          </td>
                          <td className="px-2 xl:px-3 py-4">
                            <div className="flex items-center gap-1 xl:gap-1.5 flex-wrap xl:flex-nowrap">
                              <button
                                onClick={() => handleEdit(task)}
                                className={`px-2 py-1 rounded-lg text-xs font-medium transition-all duration-200 flex-1 ${editButtonStyles}`}
                                title="Edit Task"
                              >
                                <div className="flex items-center justify-center gap-1">
                                  <MdEdit className="text-sm" /> Edit
                                </div>
                              </button>
                              <button
                                onClick={() => handleDeleteClick(task.taskId)}
                                className={`px-2 py-1 rounded-lg text-xs font-medium transition-all duration-200 flex-1 ${deleteButtonStyles}`}
                                title="Delete Task"
                              >
                                <div className="flex items-center justify-center gap-1">
                                  <MdDelete className="text-sm" /> Delete
                                </div>
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>

                {/* Mobile Cards View */}
                <div className="sm:hidden space-y-3">
                  {currentTasks.map((task) => {
                    const isOverdue = (task.status === 'Pending') && (new Date() > new Date(task.due));
                    return (
                      <div 
                        key={task.taskId} 
                        className={`
                          ${isOverdue ? `${overdueStyles} rounded-2xl` : cardStyles}
                          rounded-2xl p-4 border transition-all duration-300 
                          w-full max-w-full overflow-hidden
                        `}
                      >
                        <div className="flex justify-between items-start gap-2 mb-3">
                          <div className="flex-1 min-w-0">
                            <h3 className={`${textColor} font-semibold text-base truncate`}>{task.title}</h3>
                            <button
                              type="button"
                              onClick={() => navigate(`/task/${encodeURIComponent(task.taskId)}`)}
                              className={`font-mono text-xs font-semibold mt-1.5 px-2 py-0.5 rounded-lg border transition-colors duration-200 ${
                                theme === 'dark' 
                                  ? 'bg-emerald-500/10 border-emerald-500/15 text-emerald-400 hover:bg-emerald-500/15' 
                                  : 'bg-emerald-50/80 border-emerald-200/40 text-emerald-700 hover:bg-emerald-100/60'
                              }`}
                            >
                              ID: {task.taskId}
                            </button>
                          </div>
                          <span
                            onClick={() => navigate(`/manager-dashboard/employee-tasks/${encodeURIComponent(task.assigned)}`)}
                            className={`${employeeBadgeStyles} px-2.5 py-1 rounded-lg text-xs font-semibold hover:cursor-pointer flex-shrink-0 max-w-28 truncate transition-all duration-200`}
                            title={task.assigned}
                          >
                            {task.assigned}
                          </span>
                        </div>
                        
                        <div className="mb-3">
                          <p className={`text-sm leading-relaxed ${theme === 'dark' ? 'text-neutral-500' : 'text-neutral-500'} break-words line-clamp-2`}>
                            {task.description}
                          </p>
                        </div>
                        
                        <div className="flex justify-between items-center pt-3 border-t border-neutral-500/10 gap-2">
                          <div className="flex items-center gap-1.5 flex-1 min-w-0">
                            <span className={`text-xs ${theme === 'dark' ? 'text-neutral-600' : 'text-neutral-400'}`}>Due:</span>
                            <span className={`text-xs font-medium truncate ${isOverdue ? 'text-red-400 font-semibold' : textColor}`}>
                              {formatDate(task.due)}
                            </span>
                          </div>
                          
                          <div className="flex-shrink-0">
                            {task.status === 'Completed' ? (
                              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                                theme === 'dark' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/15' : 'bg-emerald-50/80 text-emerald-700 border border-emerald-200/40'
                              }`}>
                                Completed
                              </span>
                            ) : (
                              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                                theme === 'dark' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/15' : 'bg-amber-50/80 text-amber-700 border border-amber-200/40'
                              }`}>
                                Pending
                              </span>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex gap-2 mt-3">
                          <button
                            onClick={() => handleEdit(task)}
                            className={`flex-1 py-2 rounded-xl text-xs font-medium transition-all duration-200 ${editButtonStyles}`}
                          >
                            <div className="flex items-center justify-center gap-1">
                              <MdEdit className="text-sm" /> Edit
                            </div>
                          </button>
                          <button
                            onClick={() => handleDeleteClick(task.taskId)}
                            className={`flex-1 py-2 rounded-xl text-xs font-medium transition-all duration-200 ${deleteButtonStyles}`}
                          >
                            <div className="flex items-center justify-center gap-1">
                              <MdDelete className="text-sm" /> Delete
                            </div>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {totalPages > 1 && (
                <div className="flex flex-col items-center justify-between mt-6 pt-5 border-t border-neutral-500/10 gap-4 sm:flex-row">
                  <div className={`text-xs sm:text-sm font-medium ${theme === 'dark' ? 'text-neutral-500' : 'text-neutral-400'}`}>
                    Showing {indexOfFirstTask + 1}-{Math.min(indexOfLastTask, sortedTasks.length)} of {sortedTasks.length} tasks
                  </div>
                  
                  <div className="flex items-center space-x-1.5 flex-wrap justify-center">
                    <button
                      onClick={prevPage}
                      disabled={currentPage === 1}
                      className={`px-3 py-1.5 rounded-xl border text-xs sm:text-sm font-medium transition-all duration-200 ${
                        currentPage === 1 
                          ? 'opacity-30 cursor-not-allowed' 
                          : `${paginationButtonStyles}`
                      }`}
                    >
                      Prev
                    </button>

                    <div className="flex space-x-1">
                      {(() => {
                        let pages = [];
                        if (totalPages <= 5) {
                          pages = Array.from({ length: totalPages }, (_, i) => i + 1);
                        } else {
                          pages.push(1);
                          if (currentPage > 3) pages.push('...');
                          for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
                            pages.push(i);
                          }
                          if (currentPage < totalPages - 2) pages.push('...');
                          pages.push(totalPages);
                        }
                        return pages.map((number, idx) => 
                          number === '...' ? (
                            <span key={`ellipsis-${idx}`} className={`w-8 h-8 flex items-center justify-center text-xs sm:text-sm ${theme === 'dark' ? 'text-neutral-600' : 'text-neutral-400'}`}>…</span>
                          ) : (
                            <button
                              key={number}
                              onClick={() => paginate(number)}
                              className={`w-8 h-8 rounded-xl border text-xs sm:text-sm font-medium transition-all duration-200 ${
                                currentPage === number 
                                  ? activePageStyles 
                                  : paginationButtonStyles
                              }`}
                            >
                              {number}
                            </button>
                          )
                        );
                      })()}
                    </div>

                    <button
                      onClick={nextPage}
                      disabled={currentPage === totalPages}
                      className={`px-3 py-1.5 rounded-xl border text-xs sm:text-sm font-medium transition-all duration-200 ${
                        currentPage === totalPages 
                          ? 'opacity-30 cursor-not-allowed' 
                          : `${paginationButtonStyles}`
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
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className={`rounded-2xl border p-6 w-full max-w-md ${modalStyles}`}>
            <div className="flex items-start mb-5">
              <div className={`p-3 rounded-xl mr-3 flex-shrink-0 ${theme === 'dark' ? 'bg-red-500/10' : 'bg-red-50/80'}`}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div className="min-w-0">
                <h3 className={`text-lg font-bold mb-1.5 ${textColor}`}>Delete Task</h3>
                <p className={`text-sm ${theme === 'dark' ? 'text-neutral-400' : 'text-neutral-500'} leading-relaxed`}>
                  Are you sure you want to permanently delete task <span className="font-semibold text-emerald-500">"{taskToDelete?.title}"</span>?
                </p>
                <div className={`mt-3 py-2 px-3 rounded-lg font-mono text-xs flex justify-between items-center ${theme === 'dark' ? 'bg-neutral-900/40 text-neutral-500' : 'bg-neutral-50/60 text-neutral-400'}`}>
                  <span>Task ID:</span>
                  <span className="font-semibold">{taskToDelete?.taskId}</span>
                </div>
                <p className={`text-xs mt-3 font-medium ${theme === 'dark' ? 'text-red-400/70' : 'text-red-400/70'}`}>
                  * This action cannot be undone.
                </p>
              </div>
            </div>
            
            <div className="flex justify-end space-x-2.5 pt-3 border-t border-neutral-500/10">
              <button
                onClick={handleDeleteCancel}
                disabled={deleting}
                className={`px-4 py-2.5 rounded-xl border text-sm font-medium transition-all duration-200 ${
                  theme === 'dark' 
                    ? 'border-neutral-800/50 text-neutral-400 hover:bg-neutral-800/40 hover:text-neutral-200' 
                    : 'border-neutral-200/50 text-neutral-500 hover:bg-neutral-50/60'
                } ${deleting ? 'opacity-40 cursor-not-allowed' : ''}`}
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                disabled={deleting}
                className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.97] ${
                  theme === 'dark' 
                    ? 'bg-red-500/15 hover:bg-red-500/25 text-red-400 border border-red-500/20' 
                    : 'bg-red-50 hover:bg-red-100/80 text-red-600 border border-red-200/50'
                }`}
              >
                {deleting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-t-transparent border-red-400 mr-2"></div>
                    Deleting...
                  </>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
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