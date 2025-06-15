import axios from 'axios';
import React, { useState, useEffect } from 'react';

const TasksTable = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get('http://localhost:3001/task/alltasks');
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

  return (
    <div className="mt-8 sm:mt-12 md:mt-16 lg:mt-20 xl:mt-32 bg-neutral-900/80 backdrop-blur-sm rounded-lg sm:rounded-xl border border-neutral-800 overflow-hidden w-[95vw] sm:w-[90vw] md:w-[85vw] lg:w-[80vw] mx-auto">
      <div className="py-6 px-4 sm:py-8 sm:px-6 md:px-10 lg:px-16 xl:px-20">
        <h2 className="text-xl sm:text-2xl font-bold text-emerald-400 mb-4 sm:mb-6">Assigned Tasks</h2>
        
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-t-2 border-b-2 border-emerald-500"></div>
          </div>
        ) : tasks.length === 0 ? (
          <div className="bg-neutral-800/50 rounded-lg p-8 text-center">
            <p className="text-neutral-400">No tasks found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            {/* Desktop Table */}
            <table className="w-full border-collapse hidden sm:table">
              <thead>
                <tr className="border-b border-neutral-700">
                  <th className="px-4 py-3 sm:px-6 sm:py-4 text-left text-sm sm:text-base font-medium text-neutral-300">Task ID</th>
                  <th className="px-4 py-3 sm:px-6 sm:py-4 text-left text-sm sm:text-base font-medium text-neutral-300">Title</th>
                  <th className="px-4 py-3 sm:px-6 sm:py-4 text-left text-sm sm:text-base font-medium text-neutral-300">Assigned To</th>
                  <th className="px-4 py-3 sm:px-6 sm:py-4 text-left text-sm sm:text-base font-medium text-neutral-300">Description</th>
                  <th className="px-4 py-3 sm:px-6 sm:py-4 text-left text-sm sm:text-base font-medium text-neutral-300">Due Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800">
                {tasks.map((task) => (
                  <tr key={task.taskId} className="hover:bg-neutral-800/50 transition-colors">
                    <td className="px-4 py-3 sm:px-6 sm:py-4 text-sm sm:text-base text-neutral-300 font-mono">{task.taskId}</td>
                    <td className="px-4 py-3 sm:px-6 sm:py-4 text-sm sm:text-base text-neutral-300">{task.title}</td>
                    <td className="px-4 py-3 sm:px-6 sm:py-4 text-sm sm:text-base text-neutral-300">
                      <div className="flex items-center space-x-2">
                        <span className="bg-emerald-900/30 text-emerald-300 px-2 py-1 sm:px-3 sm:py-1.5 rounded-md text-xs sm:text-sm">
                          {task.assigned}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 sm:px-6 sm:py-4">
                      <div className="text-sm sm:text-base text-neutral-400 max-h-24 overflow-y-auto custom-scrollbar pr-2">
                        {task.description}
                      </div>
                    </td>
                    <td className="px-4 py-3 sm:px-6 sm:py-4 text-sm sm:text-base text-neutral-400">
                      {formatDate(task.due)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Mobile Cards */}
            <div className="sm:hidden space-y-4">
              {tasks.map((task) => (
                <div key={task.taskId} className="bg-neutral-800/50 rounded-lg p-4 border border-neutral-700">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-emerald-400 font-medium">{task.title}</h3>
                      <p className="text-xs text-neutral-400 font-mono mt-1">ID: {task.taskId}</p>
                    </div>
                    <span className="bg-emerald-900/30 text-emerald-300 px-2 py-1 rounded-md text-xs">
                      {task.assigned}
                    </span>
                  </div>
                  
                  <div className="mt-3">
                    <p className="text-sm text-neutral-300 line-clamp-3">{task.description}</p>
                  </div>
                  
                  <div className="mt-3 flex justify-between items-center">
                    <span className="text-xs text-neutral-500">Due Date:</span>
                    <span className="text-xs text-neutral-300">{formatDate(task.due)}</span>
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