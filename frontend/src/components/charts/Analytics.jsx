import React, { useEffect, useState } from 'react';
import axios from 'axios';
import PieChartAdmin from './PieChartAdmin';
import EmployeePerformanceChart from './EmployeePerformanceChart';
import TasksTimelineChart from './TasksTimelineChart';
import TaskCompletionRateChart from './TaskCompletionRateChart';
import OverdueTasksGauge from './OverdueTasksGauge';
import SummaryStatisticsCards from './SummaryStatisticsCards';
import { useTheme } from '../../context/themeContext';

const Analytics = () => {
  const [complete, setComplete] = useState(0);
  const [pending, setPending] = useState(0);
  const [tasksData, setTasksData] = useState([]);
  const [employeesData, setEmployeesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const { theme } = useTheme();
  const API_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';

  useEffect(() => {
    const fetchAndProcessTasks = async () => {
      try {
        const [tasksResponse, employeesResponse] = await Promise.all([
          axios.get(`${API_URL}/task/alltasks`, { withCredentials: true }),
          axios.get(`${API_URL}/user/employees`, { withCredentials: true })
        ]);

        const tasks = tasksResponse.data.tasks || [];
        const employees = employeesResponse.data.users || [];

        const completedCount = tasks.filter(task => task.status === 'Completed').length;
        const pendingCount = tasks.filter(task => task.status === 'Pending').length;

        setComplete(completedCount);
        setPending(pendingCount);
        setTasksData(tasks);
        setEmployeesData(employees);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAndProcessTasks();
  }, [API_URL]);

  // Custom styles for theme
  const containerStyles = theme === 'dark'
    ? 'glass-card-dark shadow-[0_4px_24px_rgba(0,0,0,0.2)]'
    : 'glass-card-light shadow-[0_2px_16px_rgba(0,0,0,0.03)]';

  const accentColor = theme === 'dark' ? 'text-emerald-400' : 'text-emerald-600';
  const textColor = theme === 'dark' ? 'text-neutral-300' : 'text-neutral-800';

  return (
    <div className={`p-4 sm:p-6 md:p-8 rounded-2xl w-full max-w-[1400px] mx-auto overflow-x-hidden animate-fade-in-up accent-top ${containerStyles}`}>
      
      <h1 className={`text-xl sm:text-2xl font-bold tracking-tight mb-6 sm:mb-8 mt-2 ${accentColor}`}>
        Analytics
      </h1>

      <div className={`h-px mb-8 ${theme === 'dark' ? 'bg-gradient-to-r from-transparent via-neutral-700/30 to-transparent' : 'bg-gradient-to-r from-transparent via-neutral-300/30 to-transparent'}`}></div>

      {loading ? (
        <div className={`flex justify-center items-center py-8 ${textColor}`}>
          <div className={`animate-spin rounded-full h-8 w-8 border-2 border-t-transparent ${theme === 'dark' ? 'border-emerald-500' : 'border-emerald-600'}`}></div>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {/* Summary Statistics Cards - Full Width */}
          <div className="w-full">
            <SummaryStatisticsCards />
          </div>

          {/* Two Column Grid for Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Task Status Pie Chart */}
            <div className="min-w-0 overflow-hidden">
              <PieChartAdmin completed={complete} pending={pending} />
            </div>
            
            {/* Overdue Tasks Gauge */}
            <div className="min-w-0 overflow-hidden">
              <OverdueTasksGauge tasks={tasksData} />
            </div>
          </div>

          {/* Task Completion Rate Line Chart - Full Width */}
          <div className="w-full min-w-0 overflow-hidden">
            <TaskCompletionRateChart tasks={tasksData} />
          </div>
          
          {/* Employee Performance Bar Chart - Full Width */}
          <div className="w-full min-w-0 overflow-hidden">
            <EmployeePerformanceChart 
              tasks={tasksData} 
              employees={employeesData} 
            />
          </div>
          
          {/* Tasks Timeline Chart - Full Width */}
          <div className="w-full min-w-0 overflow-hidden">
            <TasksTimelineChart tasks={tasksData} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Analytics;