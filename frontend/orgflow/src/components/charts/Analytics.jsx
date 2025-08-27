import React, { useEffect, useState } from 'react';
import axios from 'axios';
import PieChartAdmin from './PieChartAdmin';
import { useTheme } from '../../context/themeContext';

const Analytics = () => {
  const [complete, setComplete] = useState(0);
  const [pending, setPending] = useState(0);
  const [loading, setLoading] = useState(true);
  const { theme } = useTheme();

  useEffect(() => {
    const fetchAndProcessTasks = async () => {
      try {
        const response = await axios.get('http://localhost:3001/task/alltasks', {
          withCredentials: true
        });

        const tasks = response.data.tasks || [];
        const completedCount = tasks.filter(task => task.status === 'Completed').length;
        const pendingCount = tasks.filter(task => task.status === 'Pending').length;

        setComplete(completedCount);
        setPending(pendingCount);
      } catch (error) {
        console.error('Error fetching tasks:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAndProcessTasks();
  }, []);

  // Theme-based styles
  const containerStyles = theme === 'dark'
    ? 'bg-neutral-900/80 border-neutral-800'
    : 'bg-neutral-100/80 border-neutral-300';

  const accentColor = theme === 'dark' ? 'text-emerald-400' : 'text-emerald-600';
  const textColor = theme === 'dark' ? 'text-neutral-300' : 'text-neutral-800';
  const dividerColor = theme === 'dark' ? 'bg-white/20' : 'bg-neutral-400/30';

  return (
    <div className={`p-4 rounded-lg border backdrop-blur-sm w-[95vw] sm:w-[90vw] md:w-[85vw] lg:w-[80vw] mx-auto mt-10 ${containerStyles}`}>
      {/* <div className="w-full h-6"></div> */}
      
 <h1 className={`text-xl sm:text-4xl font-bold ml-3 mb-4 mt-6 sm:mb-6 ${accentColor}`}>
        Analytics
      </h1>

      <div className="relative mt-6 mb-14">
        <div className={`absolute bottom-0 left-0 w-full h-px ${dividerColor}`}></div>
      </div>

     

      {loading ? (
        <div className={`flex justify-center items-center py-6 ${textColor}`}>
          <div className={`animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-t-2 border-b-2 ${theme === 'dark' ? 'border-emerald-500' : 'border-emerald-600'}`}></div>
        </div>
      ) : (
        <PieChartAdmin completed={complete} pending={pending} />
      )}
    </div>
  );
};

export default Analytics;
