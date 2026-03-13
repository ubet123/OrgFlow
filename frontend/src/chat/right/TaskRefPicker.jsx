import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { useTheme } from '../../context/themeContext';
import useAuth from '../../statemanagement/useAuth';
import { IoClose, IoSearch } from 'react-icons/io5';

const STATUS_STYLES = {
  Pending:    'bg-amber-500/15 text-amber-400 border border-amber-500/30',
  'In Progress': 'bg-blue-500/15 text-blue-400 border border-blue-500/30',
  Completed:  'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30',
};

const TaskRefPicker = ({ onSelect, onClose }) => {
  const { theme } = useTheme();
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const API_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';

  const isDark = theme === 'dark';

  const overlayBg    = isDark ? 'bg-black/60'          : 'bg-black/30';
  const modalBg      = isDark ? 'bg-neutral-900 border-neutral-800'   : 'bg-white border-neutral-200';
  const headerText   = isDark ? 'text-neutral-100'     : 'text-neutral-900';
  const subText      = isDark ? 'text-neutral-400'     : 'text-neutral-500';
  const inputBg      = isDark ? 'bg-neutral-800 border-neutral-700 text-neutral-100 placeholder-neutral-500' : 'bg-neutral-50 border-neutral-200 text-neutral-900 placeholder-neutral-400';
  const cardBg       = isDark ? 'bg-neutral-800/60 hover:bg-neutral-800 border-neutral-700/60' : 'bg-neutral-50 hover:bg-neutral-100 border-neutral-200';
  const taskIdStyle  = isDark ? 'bg-neutral-700 text-neutral-300'     : 'bg-neutral-200 text-neutral-600';
  const divider      = isDark ? 'border-neutral-800'   : 'border-neutral-200';

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const endpoint = user?.role === 'manager' ? '/task/alltasks' : '/task/emptasks';
        const res = await axios.get(`${API_URL}${endpoint}`, { withCredentials: true });
        const data = res.data?.tasks || res.data?.data || [];
        setTasks(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('TaskRefPicker: failed to fetch tasks', err);
      } finally {
        setLoading(false);
      }
    };
    fetchTasks();
  }, [API_URL, user?.role]);

  const filtered = tasks.filter((t) => {
    if (!query.trim()) return true;
    const q = query.toLowerCase();
    return (
      (t.taskId  && t.taskId.toLowerCase().includes(q)) ||
      (t.title   && t.title.toLowerCase().includes(q)) ||
      (t.assigned && t.assigned.toLowerCase().includes(q))
    );
  });

  const handleSelect = useCallback((task) => {
    onSelect({ taskId: task.taskId, title: task.title });
    onClose();
  }, [onSelect, onClose]);

  // Close on backdrop click
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-end sm:items-center justify-center ${overlayBg} backdrop-blur-sm`}
      onClick={handleBackdropClick}
    >
      <div className={`w-full sm:max-w-md rounded-t-2xl sm:rounded-2xl border ${modalBg} shadow-2xl flex flex-col max-h-[80vh]`}>
        {/* Header */}
        <div className={`flex items-center justify-between px-5 py-4 border-b ${divider}`}>
          <div>
            <p className={`font-semibold text-sm ${headerText}`}>Reference a Task</p>
            <p className={`text-xs mt-0.5 ${subText}`}>Select a task to attach to your message</p>
          </div>
          <button
            onClick={onClose}
            className={`rounded-lg p-1.5 transition-colors ${isDark ? 'hover:bg-neutral-800 text-neutral-400 hover:text-neutral-200' : 'hover:bg-neutral-100 text-neutral-400 hover:text-neutral-700'}`}
          >
            <IoClose size={18} />
          </button>
        </div>

        {/* Search */}
        <div className={`px-4 py-3 border-b ${divider}`}>
          <div className="relative">
            <IoSearch size={15} className={`absolute left-3 top-1/2 -translate-y-1/2 ${subText}`} />
            <input
              type="text"
              placeholder="Search by task ID, title or assignee..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              autoFocus
              className={`w-full rounded-xl border pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 ${inputBg}`}
            />
          </div>
        </div>

        {/* Task list */}
        <div className="overflow-y-auto flex-1 px-3 py-2 space-y-1.5">
          {loading ? (
            <p className={`text-center py-8 text-sm ${subText}`}>Loading tasks…</p>
          ) : filtered.length === 0 ? (
            <p className={`text-center py-8 text-sm ${subText}`}>No tasks found</p>
          ) : (
            filtered.map((task) => (
              <button
                key={task.taskId || task._id}
                onClick={() => handleSelect(task)}
                className={`w-full text-left rounded-xl border px-3.5 py-2.5 transition-colors ${cardBg}`}
              >
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`font-mono text-xs px-2 py-0.5 rounded-md font-medium ${taskIdStyle}`}>
                    {task.taskId}
                  </span>
                  {task.status && (
                    <span className={`text-[11px] px-2 py-0.5 rounded-full font-medium ${STATUS_STYLES[task.status] || subText}`}>
                      {task.status}
                    </span>
                  )}
                </div>
                <p className={`mt-1 text-sm font-medium leading-snug ${headerText}`}>{task.title}</p>
                {task.assigned && (
                  <p className={`mt-0.5 text-xs ${subText}`}>Assigned to {task.assigned}</p>
                )}
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskRefPicker;
