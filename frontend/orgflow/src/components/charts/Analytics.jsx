import React, { useEffect, useState } from 'react';
import axios from 'axios';
import PieChartAdmin from './PieChartAdmin';

const Analytics = () => {
  const [complete, setComplete] = useState(0);
  const [pending, setPending] = useState(0);
  const [loading, setLoading] = useState(true);

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

  return (
  <div className="p-4">
  <div className='w-full h-6'></div>
  <div className="relative mt-6">
    <div className="absolute bottom-0 left-0 w-full h-px bg-white/20"></div>
   
    
  </div>
 <h1 className="text-xl sm:text-4xl font-bold text-emerald-400 mb-4 mt-11 sm:mb-6">Analytics</h1>

  {loading ? (
    <div className="text-white">Loading...</div>
  ) : (
    <PieChartAdmin completed={complete} pending={pending} />
  )}
</div>
  );
};

export default Analytics;