import * as React from 'react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import Box from '@mui/material/Box';
import { useTheme } from '../../context/themeContext';
import AssignmentIcon from '@mui/icons-material/Assignment';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PeopleIcon from '@mui/icons-material/People';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import SpeedIcon from '@mui/icons-material/Speed';
import { GiConfirmed } from "react-icons/gi";

const SummaryStatisticsCards = () => {
  const { theme } = useTheme();
  const API_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';

  const [stats, setStats] = useState({
    totalTasks: 0,
    completedTasks: 0,
    completionRate: 0,
    overdueTasks: 0,
    avgCompletionTime: 0,
    activeEmployees: 0,
    inProgressTasks: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get(`${API_URL}/task/analytics/stats`, { withCredentials: true });
        if (res.data.success) {
          setStats(res.data.stats);
        }
      } catch (error) {
        console.error('Error fetching analytics stats:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [API_URL]);

  const { totalTasks, completedTasks, completionRate, overdueTasks, avgCompletionTime, activeEmployees, inProgressTasks } = stats;

  const containerStyles = theme === 'dark'
    ? {
        backgroundColor: 'rgba(23, 23, 23, 0.5)',
        border: '1px solid rgba(255, 255, 255, 0.05)',
        backdropFilter: 'blur(12px)',
      }
    : {
        backgroundColor: 'rgba(255, 255, 255, 0.5)',
        border: '1px solid rgba(0, 0, 0, 0.05)',
        backdropFilter: 'blur(12px)',
      };

  const textColor = theme === 'dark' ? '#e5e5e5' : '#1f2937';
  const subtextColor = theme === 'dark' ? '#737373' : '#9ca3af';

  const statCards = [
    {
      icon: AssignmentIcon,
      label: 'Total Tasks',
      value: totalTasks,
      color: theme === 'dark' ? '#60a5fa' : '#3b82f6',
      bgColor: theme === 'dark' ? 'rgba(96, 165, 250, 0.08)' : 'rgba(59, 130, 246, 0.04)',
      borderColor: theme === 'dark' ? 'rgba(96, 165, 250, 0.12)' : 'rgba(59, 130, 246, 0.1)',
    },
    {
      icon: CheckCircleIcon,
      label: 'Completion Rate',
      value: `${completionRate}%`,
      color: theme === 'dark' ? '#34d399' : '#059669',
      bgColor: theme === 'dark' ? 'rgba(52, 211, 153, 0.08)' : 'rgba(5, 150, 105, 0.04)',
      borderColor: theme === 'dark' ? 'rgba(52, 211, 153, 0.12)' : 'rgba(5, 150, 105, 0.1)',
    },
    {
      icon: AccessTimeIcon,
      label: 'Overdue Tasks',
      value: overdueTasks,
      color: theme === 'dark' ? '#f87171' : '#dc2626',
      bgColor: theme === 'dark' ? 'rgba(248, 113, 113, 0.08)' : 'rgba(220, 38, 38, 0.04)',
      borderColor: theme === 'dark' ? 'rgba(248, 113, 113, 0.12)' : 'rgba(220, 38, 38, 0.1)',
    },
    {
      icon: SpeedIcon,
      label: 'Avg. Completion Time',
      value: `${avgCompletionTime}d`,
      color: theme === 'dark' ? '#a78bfa' : '#7c3aed',
      bgColor: theme === 'dark' ? 'rgba(167, 139, 250, 0.08)' : 'rgba(124, 58, 237, 0.04)',
      borderColor: theme === 'dark' ? 'rgba(167, 139, 250, 0.12)' : 'rgba(124, 58, 237, 0.1)',
    },
    {
      icon: PeopleIcon,
      label: 'Active Employees',
      value: activeEmployees,
      color: theme === 'dark' ? '#fbbf24' : '#d97706',
      bgColor: theme === 'dark' ? 'rgba(251, 191, 36, 0.08)' : 'rgba(217, 119, 6, 0.04)',
      borderColor: theme === 'dark' ? 'rgba(251, 191, 36, 0.12)' : 'rgba(217, 119, 6, 0.1)',
    },
    {
      icon: TrendingUpIcon,
      label: 'In Progress',
      value: inProgressTasks,
      color: theme === 'dark' ? '#fb923c' : '#ea580c',
      bgColor: theme === 'dark' ? 'rgba(251, 146, 60, 0.08)' : 'rgba(234, 88, 12, 0.04)',
      borderColor: theme === 'dark' ? 'rgba(251, 146, 60, 0.12)' : 'rgba(234, 88, 12, 0.1)',
    },
  ];

  return (
    <Box
      sx={{
        ...containerStyles,
        overflow: 'hidden',
        borderRadius: '16px',
        padding: { xs: '16px', sm: '20px', md: '24px' },
        boxShadow: theme === 'dark' 
          ? '0 4px 24px rgba(0, 0, 0, 0.2)' 
          : '0 2px 16px rgba(0, 0, 0, 0.03)',
      }}
    >
      <h2 style={{ 
        color: theme === 'dark' ? '#34d399' : '#059669', 
        fontSize: 'clamp(1rem, 4vw, 1.25rem)',
        fontWeight: '700',
        letterSpacing: '-0.01em',
        marginBottom: 'clamp(16px, 3vw, 24px)',
        marginTop: '0'
      }}>
        Key Metrics Overview
      </h2>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem' }}>
          <div style={{
            width: 32, height: 32, borderRadius: '50%',
            border: `2px solid ${theme === 'dark' ? '#34d399' : '#059669'}`,
            borderTopColor: 'transparent',
            animation: 'spin 0.8s linear infinite'
          }} />
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      ) : (
      <>
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(min(140px, 100%), 1fr))',
        gap: 'clamp(10px, 2vw, 14px)',
      }}>
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: 'clamp(14px, 3vw, 22px)',
                backgroundColor: stat.bgColor,
                borderRadius: '14px',
                border: `1px solid ${stat.borderColor}`,
                transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                cursor: 'default',
                minHeight: '100px',
              }}
              onMouseEnter={(e) => {
                if (window.innerWidth >= 768) {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = theme === 'dark' 
                    ? '0 8px 24px rgba(0, 0, 0, 0.3)' 
                    : '0 4px 16px rgba(0, 0, 0, 0.08)';
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <Icon sx={{ 
                fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2rem' }, 
                color: stat.color, 
                marginBottom: { xs: '6px', sm: '8px', md: '10px' },
                opacity: 0.9,
              }} />
              <div style={{ 
                fontSize: 'clamp(1.25rem, 5vw, 1.75rem)', 
                fontWeight: '700', 
                color: stat.color,
                marginBottom: '4px',
                lineHeight: 1,
                letterSpacing: '-0.02em',
              }}>
                {stat.value}
              </div>
              <div style={{ 
                fontSize: 'clamp(0.6rem, 2vw, 0.7rem)', 
                color: subtextColor,
                textAlign: 'center',
                fontWeight: '600',
                lineHeight: 1.2,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
              }}>
                {stat.label}
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ 
        marginTop: 'clamp(16px, 3vw, 20px)', 
        padding: 'clamp(10px, 2vw, 14px)',
        backgroundColor: theme === 'dark' ? 'rgba(52, 211, 153, 0.04)' : 'rgba(5, 150, 105, 0.02)',
        borderRadius: '12px',
        border: `1px solid ${theme === 'dark' ? 'rgba(52, 211, 153, 0.1)' : 'rgba(5, 150, 105, 0.06)'}`,
      }}>
        <div style={{ 
          fontSize: 'clamp(0.7rem, 2.5vw, 0.8rem)', 
          color: subtextColor,
          textAlign: 'center',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 'clamp(4px, 1.5vw, 6px)',
          lineHeight: 1.4
        }}>
        
        <GiConfirmed style={{ color: theme === 'dark' ? '#34d399' : '#059669', fontSize: '1.1rem' }} />
          <span>
            <strong style={{ color: textColor }}>{completedTasks}</strong> of <strong style={{ color: textColor }}>{totalTasks}</strong> tasks completed
            {overdueTasks > 0 && (
              <span> • <strong style={{ color: '#ef4444' }}>{overdueTasks}</strong> need immediate attention</span>
            )}
          </span>
        </div>
      </div>
      </>
      )}
    </Box>
  );
};

export default SummaryStatisticsCards;
