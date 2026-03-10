import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useTheme } from '../context/themeContext';
import { MdAssignment, MdCheckCircle, MdPending, MdWarning, MdTrendingUp, MdSchedule } from 'react-icons/md';

const EmployeeStats = () => {
  const { theme } = useTheme();
  const API_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await axios.get(`${API_URL}/task/emptasks`, { withCredentials: true });
        if (res.data.success) {
          const tasks = res.data.tasks;
          const now = new Date();

          const total = tasks.length;
          const completed = tasks.filter(t => t.status === 'Completed').length;
          const pending = tasks.filter(t => t.status === 'Pending').length;
          const overdue = tasks.filter(t => {
            if (t.status === 'Completed' || !t.due) return false;
            return new Date(t.due) < now;
          }).length;
          const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

          // Next upcoming deadline (pending tasks only)
          const upcomingDue = tasks
            .filter(t => t.status === 'Pending' && t.due && new Date(t.due) >= now)
            .sort((a, b) => new Date(a.due) - new Date(b.due))[0];

          const nextDeadline = upcomingDue
            ? new Date(upcomingDue.due).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
            : '—';

          setStats({ total, completed, pending, overdue, completionRate, nextDeadline });
        }
      } catch (error) {
        console.error('Error fetching employee stats:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchTasks();
  }, [API_URL]);

  // Theme styles
  const containerBg = theme === 'dark' ? 'bg-neutral-900/80 border-neutral-800' : 'bg-white border-neutral-200';
  const cardBg = theme === 'dark' ? 'bg-neutral-800/60 border-neutral-700' : 'bg-neutral-50 border-neutral-200';
  const textPrimary = theme === 'dark' ? 'text-neutral-100' : 'text-neutral-900';
  const textSecondary = theme === 'dark' ? 'text-neutral-400' : 'text-neutral-500';
  const accentColor = theme === 'dark' ? 'text-emerald-400' : 'text-emerald-600';

  if (loading) {
    return (
      <div className={`rounded-xl border p-6 mx-auto w-[95vw] sm:w-[90vw] md:w-[85vw] lg:w-[82vw] max-w-[1800px] mt-6 ${containerBg}`}>
        <div className="flex items-center justify-center py-8">
          <div className={`animate-spin rounded-full h-6 w-6 border-b-2 ${theme === 'dark' ? 'border-emerald-400' : 'border-emerald-600'}`} />
          <span className={`ml-3 text-sm ${textSecondary}`}>Loading stats...</span>
        </div>
      </div>
    );
  }

  if (!stats) return null;

  const cards = [
    { label: 'Total Tasks', value: stats.total, icon: MdAssignment, color: theme === 'dark' ? 'text-blue-400' : 'text-blue-600', iconBg: theme === 'dark' ? 'bg-blue-400/10' : 'bg-blue-50' },
    { label: 'Completed', value: stats.completed, icon: MdCheckCircle, color: theme === 'dark' ? 'text-emerald-400' : 'text-emerald-600', iconBg: theme === 'dark' ? 'bg-emerald-400/10' : 'bg-emerald-50' },
    { label: 'Pending', value: stats.pending, icon: MdPending, color: theme === 'dark' ? 'text-amber-400' : 'text-amber-600', iconBg: theme === 'dark' ? 'bg-amber-400/10' : 'bg-amber-50' },
    { label: 'Overdue', value: stats.overdue, icon: MdWarning, color: theme === 'dark' ? 'text-red-400' : 'text-red-600', iconBg: theme === 'dark' ? 'bg-red-400/10' : 'bg-red-50' },
    { label: 'Completion Rate', value: `${stats.completionRate}%`, icon: MdTrendingUp, color: theme === 'dark' ? 'text-violet-400' : 'text-violet-600', iconBg: theme === 'dark' ? 'bg-violet-400/10' : 'bg-violet-50' },
    { label: 'Next Deadline', value: stats.nextDeadline, icon: MdSchedule, color: theme === 'dark' ? 'text-cyan-400' : 'text-cyan-600', iconBg: theme === 'dark' ? 'bg-cyan-400/10' : 'bg-cyan-50' },
  ];

  return (
    <div className={`rounded-xl border p-4 sm:p-6 mx-auto w-[95vw] sm:w-[90vw] md:w-[85vw] lg:w-[82vw] max-w-[1800px] mt-6 ${containerBg}`}>
      <h3 className={`text-lg sm:text-xl font-semibold mb-4 ${accentColor}`}>My Overview</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        {cards.map((card) => (
          <div key={card.label} className={`rounded-lg border p-3 sm:p-4 flex flex-col gap-2 ${cardBg}`}>
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${card.iconBg}`}>
              <card.icon className={`text-lg ${card.color}`} />
            </div>
            <div>
              <p className={`text-xl sm:text-2xl font-bold ${textPrimary}`}>{card.value}</p>
              <p className={`text-xs sm:text-sm ${textSecondary}`}>{card.label}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EmployeeStats;
