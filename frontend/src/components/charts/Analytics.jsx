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
    ? 'bg-neutral-900/80 border-neutral-800'
    : 'bg-neutral-100/80 border-neutral-300';

  const accentColor = theme === 'dark' ? 'text-emerald-400' : 'text-emerald-600';
  const textColor = theme === 'dark' ? 'text-neutral-300' : 'text-neutral-800';
  const dividerColor = theme === 'dark' ? 'bg-white/20' : 'bg-neutral-400/30';

  return (
    <div className={`p-2 sm:p-4 rounded-lg border backdrop-blur-sm w-[98vw] sm:w-[95vw] md:w-[90vw] lg:w-[85vw] xl:w-[80vw] mx-auto mt-4 sm:mt-6 md:mt-10 ${containerStyles}`}>
      
      <h1 className={`text-lg sm:text-2xl md:text-3xl lg:text-4xl font-bold ml-1 sm:ml-2 md:ml-3 mb-3 sm:mb-4 md:mb-6 mt-4 sm:mt-6 ${accentColor}`}>
        Analytics
      </h1>

      <div className="relative mt-4 sm:mt-6 mb-8 sm:mb-10 md:mb-14">
        <div className={`absolute bottom-0 left-0 w-full h-px ${dividerColor}`}></div>
      </div>

      {loading ? (
        <div className={`flex justify-center items-center py-6 ${textColor}`}>
          <div className={`animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-t-2 border-b-2 ${theme === 'dark' ? 'border-emerald-500' : 'border-emerald-600'}`}></div>
        </div>
      ) : (
        <div className="flex flex-col gap-4 sm:gap-6">
          {/* Summary Statistics Cards - Full Width */}
          <div className="w-full">
            <SummaryStatisticsCards 
              tasks={tasksData} 
              employees={employeesData} 
            />
          </div>

          {/* Two Column Grid for Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            {/* Task Status Pie Chart */}
            <div>
              <PieChartAdmin completed={complete} pending={pending} />
            </div>
            
            {/* Overdue Tasks Gauge */}
            <div>
              <OverdueTasksGauge tasks={tasksData} />
            </div>
          </div>

          {/* Task Completion Rate Line Chart - Full Width */}
          <div className="w-full">
            <TaskCompletionRateChart tasks={tasksData} />
          </div>
          
          {/* Employee Performance Bar Chart - Full Width */}
          <div className="w-full">
            <EmployeePerformanceChart 
              tasks={tasksData} 
              employees={employeesData} 
            />
          </div>
          
          {/* Tasks Timeline Chart - Full Width */}
          <div className="w-full">
            <TasksTimelineChart tasks={tasksData} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Analytics;