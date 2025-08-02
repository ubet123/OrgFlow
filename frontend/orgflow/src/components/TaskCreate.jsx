import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const TaskCreate = () => {
  const [employees, setEmployees] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await axios.get('http://localhost:3001/user/employees', {
          withCredentials: true
        });
        setEmployees(response.data.users); 
      } catch (err) {
        console.error('Error fetching employees:', err);
      }
    }
    fetchEmployees();
  }, []);

  const generateShortId = () => uuidv4().substring(0, 5).toUpperCase();

  const [taskForm, setTaskForm] = useState({
    taskId: generateShortId(),
    title: '',
    description: '',
    assignedTo: '',
    dueDate: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTaskForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await axios.post('http://localhost:3001/task/create', {
        taskId: taskForm.taskId,
        title: taskForm.title,
        description: taskForm.description,
        assignedTo: taskForm.assignedTo,
        dueDate: taskForm.dueDate
      }, {
        withCredentials: true
      });

      toast.success('Task created successfully!');
      
      // Reset form
      setTaskForm({
        taskId: generateShortId(),
        title: '',
        description: '',
        assignedTo: '',
        dueDate: ''
      });

    } catch (error) {
      console.error('Error creating task:', error);
      toast.error(error.response?.data?.msg || 'Failed to create task');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-neutral-900/80 backdrop-blur-sm rounded-xl border border-neutral-800 py-6 px-4 sm:py-8 sm:px-6 md:px-12 lg:px-24 my-4 w-full sm:w-[90vw] md:w-[82vw] max-w-[1800px] mx-auto">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
        <h2 className="text-xl sm:text-2xl font-semibold text-emerald-400">Create New Task</h2>
        <div className="text-sm sm:text-md font-medium text-neutral-400">
          Task ID: <span className="font-mono text-emerald-300 text-lg sm:text-xl">{taskForm.taskId}</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Task Title - Full width */}
          <div className="md:col-span-2">
            <label className="block text-lg sm:text-md font-medium text-neutral-300 mb-2">Task Title*</label>
            <input
              type="text"
              name="title"
              value={taskForm.title}
              onChange={handleInputChange}
              required
              className="w-full px-4 sm:px-5 py-2 sm:py-3 text-base sm:text-lg rounded-xl bg-neutral-800 border border-neutral-700 focus:outline-none focus:ring-2 focus:ring-emerald-700 text-white"
              placeholder="Enter task title"
            />
          </div>

          {/* Assign To */}
          <div>
            <label className="block text-lg  sm:text-md font-medium text-neutral-300 mb-2">Assign To*</label>
            <select
              name="assignedTo"
              value={taskForm.assignedTo}
              onChange={handleInputChange}
              required
              className="w-full px-4 sm:px-5 py-2 sm:py-3 text-base sm:text-lg rounded-xl bg-neutral-800 border border-neutral-700 focus:outline-none focus:ring-2 focus:ring-emerald-700 text-white"
            >
              <option value="">Select Employee</option>
              {employees.map(emp => (
                <option key={emp.id} value={emp.name}>
                  {emp.name} ({emp.role})
                </option>
              ))}
            </select>
          </div>

          {/* Due Date */}
          <div>
            <label className="block text-lg  sm:text-md font-medium text-neutral-300 mb-2">Due Date*</label>
            <input
              type="date"
              name="dueDate"
              value={taskForm.dueDate}
              onChange={handleInputChange}
              required
              min={new Date().toISOString().split('T')[0]}
              className="w-full px-4 sm:px-5 py-2 sm:py-3 text-base sm:text-lg rounded-xl bg-neutral-800 border border-neutral-700 focus:outline-none focus:ring-2 focus:ring-emerald-700 text-white"
            />
          </div>
        </div>

        {/* Task Description */}
        <div>
          <label className="block text-lg  sm:text-md font-medium text-neutral-300 mb-2">Description*</label>
          <textarea
            name="description"
            value={taskForm.description}
            onChange={handleInputChange}
            required
            rows={5}
            className="w-full px-4 sm:px-5 py-2 sm:py-3 text-base sm:text-lg rounded-xl bg-neutral-800 border border-neutral-700 focus:outline-none focus:ring-2 focus:ring-emerald-700 text-white"
            placeholder="Describe the task details..."
          />
        </div>

        {/* Submit Button */}
        <div className="pt-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`bg-emerald-700 hover:bg-emerald-600 text-white px-6 sm:px-8 py-3 sm:py-3.5 rounded-xl transition-colors font-medium flex items-center justify-center w-full text-base sm:text-lg ${
              isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
            }`}
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 sm:mr-3 h-5 w-5 sm:h-6 sm:w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Creating...
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6 mr-2 sm:mr-3" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                </svg>
                Create Task
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default TaskCreate;