import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import ManagerTop from '../components/ManagerTop';
import TaskCreate from '../components/TaskCreate';
import TasksTable from '../components/TasksTable';
import Analytics from '../components/charts/Analytics';
import { useTheme } from '../context/themeContext';

const ManagerDash = ({ onLogout }) => {
    const {theme,toggleTheme} = useTheme();
    return (
        <div className={`min-h-screen animate-fade-in ${theme==='dark'?'bg-neutral-950 text-neutral-300':'bg-neutral-50 text-neutral-900'}`}>
           
            <ManagerTop onLogout={onLogout} />
            
           
            <main className="px-4 py-8 sm:px-6 lg:px-8 max-w-[1400px] mx-auto space-y-8">
                <TaskCreate />
                <TasksTable/>
                <Analytics/>
            </main>
        </div>
    );
};

export default ManagerDash;