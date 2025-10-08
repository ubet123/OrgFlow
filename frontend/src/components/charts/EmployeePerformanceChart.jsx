import * as React from 'react';
import Box from '@mui/material/Box';
import { BarChart } from '@mui/x-charts/BarChart';
import { useTheme } from '../../context/themeContext';

const EmployeePerformanceChart = ({ tasks, employees }) => {
  const { theme } = useTheme();

  // Calculate completion rate for each employee
  const employeePerformance = employees.map(employee => {
    const employeeTasks = tasks.filter(task => task.assigned === employee.name);
    const totalTasks = employeeTasks.length;
    const completedTasks = employeeTasks.filter(task => task.status === 'Completed').length;
    const completionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

    return {
      employee: employee.name,
      completed: completedTasks,
      pending: totalTasks - completedTasks,
      completionRate: Math.round(completionRate)
    };
  }).filter(emp => emp.completed + emp.pending > 0); // Only show employees with tasks

  // Sort by completion rate (descending)
  employeePerformance.sort((a, b) => b.completionRate - a.completionRate);

  const chartData = {
    series: [
      {
        data: employeePerformance.map(emp => emp.completed),
        label: 'Completed',
        color: theme === 'dark' ? '#34d399' : '#059669',
      },
      {
        data: employeePerformance.map(emp => emp.pending),
        label: 'Pending',
        color: theme === 'dark' ? '#facc15' : '#ca8a04',
      }
    ],
    xAxis: [
      {
        data: employeePerformance.map(emp => emp.employee),
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
        Employee Performance
      </h1>
      {employeePerformance.length > 0 ? (
        <BarChart
          dataset={employeePerformance}
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
          }}
        />
      ) : (
        <div className={`text-center py-8 ${theme === 'dark' ? 'text-neutral-400' : 'text-neutral-600'}`}>
          No task data available for employees
        </div>
      )}
    </Box>
  );
};

export default EmployeePerformanceChart;