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

  return (
    <div className="mt-32 bg-neutral-900/80 backdrop-blur-sm rounded-xl border border-neutral-800 overflow-hidden  w-[80vw] mx-5">
      <div className="py-16 px-20 ">
        <h2 className="text-2xl font-bold text-emerald-400 mb-6">Assigned Tasks</h2>
        
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-neutral-700">
                  <th className="px-6 py-4 text-left text-base font-medium text-neutral-300">Task ID</th>
                  <th className="px-6 py-4 text-left text-base font-medium text-neutral-300">Title</th>
                  <th className="px-6 py-4 text-left text-base font-medium text-neutral-300">Assigned To</th>
                  <th className="px-6 py-4 text-left text-base font-medium text-neutral-300">Description</th>
                  <th className="px-6 py-4 text-left text-base font-medium text-neutral-300">Due Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800">
                {tasks.map((task) => (
                  <tr key={task.taskId} className="hover:bg-neutral-800/50 transition-colors">
                    <td className="px-6 py-4 w-32 text-base text-neutral-300 font-mono">{task.taskId}</td>
                    <td className="px-6 py-4 w-52 text-base text-neutral-300">{task.title}</td>
                    <td className="px-6 py-4 w-52 text-base text-neutral-300">
                      <div className="flex items-center space-x-2">
                        <span className="bg-emerald-900/30 text-emerald-300 px-3 py-1.5 rounded-md text-sm">
                          {task.assigned}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 max-w-md w-[700px]">
                      <div className="text-base text-neutral-400 max-h-24 overflow-y-auto custom-scrollbar pr-2">
                        {task.description}
                      </div>
                    </td>
                    <td className="px-6 py-4 w-36 text-base text-neutral-400">
                      {new Date(task.due).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default TasksTable;