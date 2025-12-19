import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useTheme } from '../context/themeContext';

const EditTaskForm = ({ task, employees, onClose, onTaskUpdated }) => {
  const [editForm, setEditForm] = useState({
    taskId: '',
    title: '',
    description: '',
    due: '',
    status: '',
    assigned: ''
  });
  const [loading, setLoading] = useState(false);
  const { theme } = useTheme();
  const API_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';

  useEffect(() => {
    if (task) {
      setEditForm({
        taskId: task.taskId || '',
        title: task.title || '',
        description: task.description || '',
        due: task.due ? task.due.split('T')[0] : '',
        status: task.status || 'Pending',
        assigned: task.assigned || ''
      });
    }
  }, [task]);

  const handleSave = async () => {
    if (!editForm.taskId || !editForm.title || !editForm.assigned || !editForm.due) {
      toast.error('Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.put(
        `${API_URL}/task/edittask/${editForm.taskId}`,
        editForm,
        { withCredentials: true }
      );
      
      toast.success(response.data.message || 'Task updated successfully!');
      if (onTaskUpdated) {
        onTaskUpdated(response.data.task);
      }
      onClose();
    } catch (error) {
      console.error('Error updating task:', error);
      toast.error(error.response?.data?.message || 'Failed to update task');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const modalStyles = theme === 'dark' 
    ? 'bg-neutral-900/90 border-neutral-800' 
    : 'bg-white border-neutral-300';
  
  const textColor = theme === 'dark' ? 'text-neutral-300' : 'text-neutral-800';
  const inputStyles = theme === 'dark'
    ? 'bg-neutral-800 border-neutral-700 text-neutral-300 placeholder-neutral-500'
    : 'bg-white border-neutral-300 text-neutral-800 placeholder-neutral-500';
  
  const labelStyles = theme === 'dark' ? 'text-neutral-400' : 'text-neutral-600';
  const accentColor = theme === 'dark' ? 'text-emerald-400' : 'text-emerald-600';
  
  const saveButtonStyles = theme === 'dark'
    ? 'bg-emerald-700 hover:bg-emerald-600 text-white'
    : 'bg-emerald-500 hover:bg-emerald-600 text-white';
  
  const cancelButtonStyles = theme === 'dark'
    ? 'bg-neutral-700 hover:bg-neutral-600 text-neutral-300'
    : 'bg-neutral-300 hover:bg-neutral-400 text-neutral-700';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className={`backdrop-blur-sm rounded-xl border p-4 sm:p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto ${modalStyles}`}>
        <div className="flex items-center justify-between mb-4">
          <h2 className={`text-xl font-bold ${accentColor}`}>Edit Task</h2>
          <button
            onClick={onClose}
            className={`p-1 rounded-lg hover:bg-neutral-800 ${theme === 'dark' ? 'text-neutral-400 hover:text-neutral-300' : 'text-neutral-600 hover:text-neutral-800'}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={`block text-sm font-medium mb-1 ${labelStyles}`}>
                Task ID *
              </label>
              <input
                type="text"
                name="taskId"
                value={editForm.taskId}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-lg text-sm ${inputStyles}`}
                required
              />
            </div>

            <div>
              <label className={`block text-sm font-medium mb-1 ${labelStyles}`}>
                Title *
              </label>
              <input
                type="text"
                name="title"
                value={editForm.title}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-lg text-sm ${inputStyles}`}
                required
              />
            </div>

            <div>
              <label className={`block text-sm font-medium mb-1 ${labelStyles}`}>
                Assigned To *
              </label>
              <select
                name="assigned"
                value={editForm.assigned}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-lg text-sm ${inputStyles}`}
                required
              >
                <option value="">Select Employee</option>
                {employees.map((employee) => (
                  <option key={employee._id || employee.id} value={employee.name}>
                    {employee.name} {employee.role ? `(${employee.role})` : ''}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className={`block text-sm font-medium mb-1 ${labelStyles}`}>
                Status
              </label>
              <select
                name="status"
                value={editForm.status}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-lg text-sm ${inputStyles}`}
              >
                <option value="Pending">Pending</option>
                <option value="Completed">Completed</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className={`block text-sm font-medium mb-1 ${labelStyles}`}>
                Due Date *
              </label>
              <input
                type="date"
                name="due"
                value={editForm.due}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-lg text-sm ${inputStyles}`}
                required
              />
            </div>

            <div className="sm:col-span-2">
              <label className={`block text-sm font-medium mb-1 ${labelStyles}`}>
                Description
              </label>
              <textarea
                name="description"
                value={editForm.description}
                onChange={handleInputChange}
                rows="4"
                className={`w-full px-3 py-2 border rounded-lg text-sm ${inputStyles}`}
              />
            </div>
          </div>

          <div className="flex space-x-3 pt-4 border-t border-neutral-700">
            <button
              onClick={onClose}
              disabled={loading}
              className={`px-4 py-2 rounded-lg font-medium ${cancelButtonStyles} flex-1`}
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={loading}
              className={`px-4 py-2 rounded-lg font-medium ${saveButtonStyles} flex-1 flex items-center justify-center`}
            >
              {loading ? (
                <>
                  <div className={`animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 ${theme === 'dark' ? 'border-white' : 'border-white'} mr-2`}></div>
                  Saving...
                </>
              ) : (
                'Save Changes'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditTaskForm;