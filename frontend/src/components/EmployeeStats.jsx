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
  const containerBg = theme === 'dark' 
    ? 'glass-card-dark shadow-[0_4px_24px_rgba(0,0,0,0.2)]' 
    : 'glass-card-light shadow-[0_2px_16px_rgba(0,0,0,0.03)]';
  
  const cardBg = theme === 'dark' 
    ? 'bg-neutral-900/30 border-neutral-800/40 hover:border-neutral-700/50 hover:-translate-y-0.5 hover:shadow-lg' 
    : 'bg-white/50 border-neutral-200/40 hover:border-neutral-300/50 hover:-translate-y-0.5 hover:shadow-md';
    
  const textPrimary = theme === 'dark' ? 'text-neutral-100' : 'text-neutral-900';
  const textSecondary = theme === 'dark' ? 'text-neutral-500' : 'text-neutral-500';
  const accentColor = theme === 'dark' ? 'text-emerald-400' : 'text-emerald-600';

  if (loading) {
    return (
      <div className={`rounded-2xl p-6 mx-auto max-w-[1400px] mt-6 w-full ${containerBg}`}>
        <div className="flex items-center justify-center py-8">
          <div className={`animate-spin rounded-full h-5 w-5 border-2 border-t-transparent ${theme === 'dark' ? 'border-emerald-400' : 'border-emerald-600'}`} />
          <span className={`ml-3 text-sm ${textSecondary}`}>Loading stats...</span>
        </div>
      </div>
    );
  }

  if (!stats) return null;

  const cards = [
    { label: 'Total Tasks', value: stats.total, icon: MdAssignment, color: theme === 'dark' ? 'text-blue-400' : 'text-blue-600', iconBg: theme === 'dark' ? 'bg-blue-500/10 border-blue-500/10' : 'bg-blue-50/80 border-blue-100/50' },
    { label: 'Completed', value: stats.completed, icon: MdCheckCircle, color: theme === 'dark' ? 'text-emerald-400' : 'text-emerald-600', iconBg: theme === 'dark' ? 'bg-emerald-500/10 border-emerald-500/10' : 'bg-emerald-50/80 border-emerald-100/50' },
    { label: 'Pending', value: stats.pending, icon: MdPending, color: theme === 'dark' ? 'text-amber-400' : 'text-amber-600', iconBg: theme === 'dark' ? 'bg-amber-500/10 border-amber-500/10' : 'bg-amber-50/80 border-amber-100/50' },
    { label: 'Overdue', value: stats.overdue, icon: MdWarning, color: theme === 'dark' ? 'text-red-400' : 'text-red-600', iconBg: theme === 'dark' ? 'bg-red-500/10 border-red-500/10' : 'bg-red-50/80 border-red-100/50' },
    { label: 'Completion Rate', value: `${stats.completionRate}%`, icon: MdTrendingUp, color: theme === 'dark' ? 'text-violet-400' : 'text-violet-600', iconBg: theme === 'dark' ? 'bg-violet-500/10 border-violet-500/10' : 'bg-violet-50/80 border-violet-100/50' },
    { label: 'Next Deadline', value: stats.nextDeadline, icon: MdSchedule, color: theme === 'dark' ? 'text-cyan-400' : 'text-cyan-600', iconBg: theme === 'dark' ? 'bg-cyan-500/10 border-cyan-500/10' : 'bg-cyan-50/80 border-cyan-100/50' },
  ];

  return (
    <div className={`rounded-2xl p-6 sm:p-8 mx-auto max-w-[1400px] mt-6 w-full animate-fade-in-up ${containerBg}`}>
      <h3 className={`text-base font-semibold mb-5 tracking-tight ${accentColor}`}>My Overview</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        {cards.map((card) => (
          <div key={card.label} className={`rounded-2xl border p-4 flex flex-col gap-3 transition-all duration-300 cursor-default ${cardBg}`}>
            <div className={`w-9 h-9 rounded-xl border flex items-center justify-center ${card.iconBg}`}>
              <card.icon className={`text-lg ${card.color}`} />
            </div>
            <div>
              <p className={`text-2xl font-bold tracking-tight leading-none ${textPrimary}`}>{card.value}</p>
              <p className={`text-[11px] font-medium uppercase tracking-wider ${textSecondary} mt-1.5`}>{card.label}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EmployeeStats;
