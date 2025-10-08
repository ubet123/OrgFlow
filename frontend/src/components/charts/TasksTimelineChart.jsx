import * as React from 'react';
import Box from '@mui/material/Box';
import { LineChart } from '@mui/x-charts/LineChart';
import { useTheme } from '../../context/themeContext';

const TasksTimelineChart = ({ tasks }) => {
  const { theme } = useTheme();

  // Process tasks by month
  const processTasksByMonth = () => {
    const monthlyData = {};
    
    tasks.forEach(task => {
      if (task.createdAt) {
        const date = new Date(task.createdAt);
        const monthYear = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        const monthName = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
        
        if (!monthlyData[monthYear]) {
          monthlyData[monthYear] = {
            month: monthName,
            assigned: 0,
            completed: 0
          };
        }
        
        monthlyData[monthYear].assigned++;
        if (task.status === 'Completed') {
          monthlyData[monthYear].completed++;
        }
      }
    });

    // Convert to array and sort by date
    return Object.values(monthlyData)
      .sort((a, b) => new Date(a.month) - new Date(b.month))
      .slice(-6); // Last 6 months
  };

  const monthlyData = processTasksByMonth();

  const chartData = {
    series: [
      {
        data: monthlyData.map(data => data.assigned),
        label: 'Tasks Assigned',
        color: theme === 'dark' ? '#60a5fa' : '#2563eb', // blue
      },
      {
        data: monthlyData.map(data => data.completed),
        label: 'Tasks Completed',
        color: theme === 'dark' ? '#34d399' : '#059669', // emerald
      },
    ],
    xAxis: [
      {
        data: monthlyData.map(data => data.month),
        scaleType: 'band',
      },
    ],
  };

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

  return (
    <Box
      sx={{
        width: '100%',
        borderRadius: '12px',
        p: 3,
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
        ...containerStyles,
      }}
    >
      <h1 className={`text-2xl font-bold mb-4 ml-2 ${theme === 'dark' ? 'text-emerald-400' : 'text-emerald-600'}`}>
        Tasks Timeline
      </h1>
      {monthlyData.length > 0 ? (
        <LineChart
          xAxis={chartData.xAxis}
          series={chartData.series}
          height={350}
          slotProps={{
            legend: {
              labelStyle: {
                fill: textColor,
                fontSize: 14,
              },
            },
          }}
          sx={{
            '& .MuiChartsLegend-root': {
              color: `${textColor} !important`,
            },
            '& .MuiChartsAxis-root .MuiChartsAxis-tickLabel': {
              fill: textColor,
              fontSize: 12,
            },
            '& .MuiChartsAxis-root .MuiChartsAxis-line': {
              stroke: textColor,
            },
            '& .MuiMarkElement-root': {
              strokeWidth: 2,
            },
          }}
        />
      ) : (
        <div className={`text-center py-8 ${theme === 'dark' ? 'text-neutral-400' : 'text-neutral-600'}`}>
          No timeline data available
        </div>
      )}
    </Box>
  );
};

export default TasksTimelineChart;