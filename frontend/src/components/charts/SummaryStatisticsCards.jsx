import * as React from 'react';
import Box from '@mui/material/Box';
import { useTheme } from '../../context/themeContext';
import AssignmentIcon from '@mui/icons-material/Assignment';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PeopleIcon from '@mui/icons-material/People';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import SpeedIcon from '@mui/icons-material/Speed';

const SummaryStatisticsCards = ({ tasks, employees }) => {
  const { theme } = useTheme();

  // Calculate statistics
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(task => task.status === 'Completed').length;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Calculate overdue tasks
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const overdueTasks = tasks.filter(task => {
    const dueDate = new Date(task.due);
    dueDate.setHours(0, 0, 0, 0);
    return task.status !== 'Completed' && dueDate < now;
  }).length;

  // Calculate average completion time (in days)
  const completedTasksWithDates = tasks.filter(task => 
    task.status === 'Completed' && task.createdAt && task.updatedAt
  );
  
  const avgCompletionTime = completedTasksWithDates.length > 0
    ? Math.round(
        completedTasksWithDates.reduce((acc, task) => {
          const created = new Date(task.createdAt);
          const completed = new Date(task.updatedAt);
          const days = Math.max(0, Math.ceil((completed - created) / (1000 * 60 * 60 * 24)));
          return acc + days;
        }, 0) / completedTasksWithDates.length
      )
    : 0;

  // Active employees (employees with tasks)
  const activeEmployees = employees.filter(emp => 
    tasks.some(task => task.assigned === emp.name)
  ).length;

  // Tasks in progress
  const inProgressTasks = tasks.filter(task => task.status === 'In Progress').length;

  const containerStyles = theme === 'dark'
    ? {
        backgroundColor: 'rgb(23 23 23 / 0.8)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
      }
    : {
        backgroundColor: 'rgba(245, 245, 245, 0.8)',
        border: '1px solid rgba(0, 0, 0, 0.1)',
      };

  const textColor = theme === 'dark' ? '#e5e5e5' : '#1f2937';
  const subtextColor = theme === 'dark' ? '#a3a3a3' : '#6b7280';

  const stats = [
    {
      icon: AssignmentIcon,
      label: 'Total Tasks',
      value: totalTasks,
      color: theme === 'dark' ? '#60a5fa' : '#3b82f6',
      bgColor: theme === 'dark' ? 'rgba(96, 165, 250, 0.1)' : 'rgba(59, 130, 246, 0.05)',
      borderColor: theme === 'dark' ? 'rgba(96, 165, 250, 0.3)' : 'rgba(59, 130, 246, 0.2)',
    },
    {
      icon: CheckCircleIcon,
      label: 'Completion Rate',
      value: `${completionRate}%`,
      color: theme === 'dark' ? '#34d399' : '#059669',
      bgColor: theme === 'dark' ? 'rgba(52, 211, 153, 0.1)' : 'rgba(5, 150, 105, 0.05)',
      borderColor: theme === 'dark' ? 'rgba(52, 211, 153, 0.3)' : 'rgba(5, 150, 105, 0.2)',
    },
    {
      icon: AccessTimeIcon,
      label: 'Overdue Tasks',
      value: overdueTasks,
      color: theme === 'dark' ? '#f87171' : '#dc2626',
      bgColor: theme === 'dark' ? 'rgba(248, 113, 113, 0.1)' : 'rgba(220, 38, 38, 0.05)',
      borderColor: theme === 'dark' ? 'rgba(248, 113, 113, 0.3)' : 'rgba(220, 38, 38, 0.2)',
    },
    {
      icon: SpeedIcon,
      label: 'Avg. Completion Time',
      value: `${avgCompletionTime}d`,
      color: theme === 'dark' ? '#a78bfa' : '#7c3aed',
      bgColor: theme === 'dark' ? 'rgba(167, 139, 250, 0.1)' : 'rgba(124, 58, 237, 0.05)',
      borderColor: theme === 'dark' ? 'rgba(167, 139, 250, 0.3)' : 'rgba(124, 58, 237, 0.2)',
    },
    {
      icon: PeopleIcon,
      label: 'Active Employees',
      value: activeEmployees,
      color: theme === 'dark' ? '#fbbf24' : '#d97706',
      bgColor: theme === 'dark' ? 'rgba(251, 191, 36, 0.1)' : 'rgba(217, 119, 6, 0.05)',
      borderColor: theme === 'dark' ? 'rgba(251, 191, 36, 0.3)' : 'rgba(217, 119, 6, 0.2)',
    },
    {
      icon: TrendingUpIcon,
      label: 'In Progress',
      value: inProgressTasks,
      color: theme === 'dark' ? '#fb923c' : '#ea580c',
      bgColor: theme === 'dark' ? 'rgba(251, 146, 60, 0.1)' : 'rgba(234, 88, 12, 0.05)',
      borderColor: theme === 'dark' ? 'rgba(251, 146, 60, 0.3)' : 'rgba(234, 88, 12, 0.2)',
    },
  ];

  return (
    <Box
      sx={{
        ...containerStyles,
        borderRadius: { xs: '8px', sm: '12px' },
        padding: { xs: '12px', sm: '16px', md: '20px' },
        boxShadow: theme === 'dark' 
          ? '0 4px 6px rgba(0, 0, 0, 0.3)' 
          : '0 2px 4px rgba(0, 0, 0, 0.1)',
      }}
    >
      <h2 style={{ 
        color: textColor, 
        fontSize: 'clamp(1rem, 4vw, 1.25rem)',
        fontWeight: 'bold',
        marginBottom: 'clamp(12px, 3vw, 20px)',
        marginTop: '0'
      }}>
        Key Metrics Overview
      </h2>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(min(140px, 100%), 1fr))',
        gap: 'clamp(10px, 2vw, 16px)',
      }}>
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: 'clamp(12px, 3vw, 20px)',
                backgroundColor: stat.bgColor,
                borderRadius: 'clamp(8px, 2vw, 12px)',
                border: `1px solid ${stat.borderColor}`,
                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                cursor: 'default',
                minHeight: '100px',
              }}
              onMouseEnter={(e) => {
                if (window.innerWidth >= 768) {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = theme === 'dark' 
                    ? '0 8px 16px rgba(0, 0, 0, 0.4)' 
                    : '0 4px 8px rgba(0, 0, 0, 0.15)';
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <Icon sx={{ 
                fontSize: { xs: '1.75rem', sm: '2rem', md: '2.5rem' }, 
                color: stat.color, 
                marginBottom: { xs: '4px', sm: '6px', md: '8px' }
              }} />
              <div style={{ 
                fontSize: 'clamp(1.25rem, 5vw, 2rem)', 
                fontWeight: 'bold', 
                color: stat.color,
                marginBottom: '4px',
                lineHeight: 1
              }}>
                {stat.value}
              </div>
              <div style={{ 
                fontSize: 'clamp(0.7rem, 2.5vw, 0.875rem)', 
                color: subtextColor,
                textAlign: 'center',
                fontWeight: '500',
                lineHeight: 1.2
              }}>
                {stat.label}
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ 
        marginTop: 'clamp(12px, 3vw, 20px)', 
        padding: 'clamp(8px, 2vw, 12px)',
        backgroundColor: theme === 'dark' ? 'rgba(52, 211, 153, 0.05)' : 'rgba(5, 150, 105, 0.03)',
        borderRadius: 'clamp(6px, 1.5vw, 8px)',
        border: `1px solid ${theme === 'dark' ? 'rgba(52, 211, 153, 0.2)' : 'rgba(5, 150, 105, 0.1)'}`,
      }}>
        <div style={{ 
          fontSize: 'clamp(0.7rem, 2.5vw, 0.875rem)', 
          color: subtextColor,
          textAlign: 'center',
          display: 'flex',
          flexDirection: window.innerWidth < 640 ? 'column' : 'row',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 'clamp(4px, 1.5vw, 6px)',
          lineHeight: 1.4
        }}>
          <span style={{ fontSize: 'clamp(1rem, 3vw, 1.25rem)' }}>💡</span>
          <span>
            <strong style={{ color: textColor }}>{completedTasks}</strong> of <strong style={{ color: textColor }}>{totalTasks}</strong> tasks completed
            {overdueTasks > 0 && (
              <span> • <strong style={{ color: '#ef4444' }}>{overdueTasks}</strong> need immediate attention</span>
            )}
          </span>
        </div>
      </div>
    </Box>
  );
};

export default SummaryStatisticsCards;
