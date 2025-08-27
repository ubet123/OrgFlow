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
        <div className={`min-h-screen ${theme==='dark'?'bg-neutral-950 text-neutral-300':'bg-neutral-100 text-neutral-900'}`}>
            {/* Now ManagerTop is just the header */}
            <ManagerTop onLogout={onLogout} />
            
            {/* Content sits right below with minimal gap */}
            <main className="p-6 max-w-7xl mx-auto">
                <TaskCreate />
                <TasksTable/>
                <Analytics/>
            </main>
        </div>
    );
};

export default ManagerDash;