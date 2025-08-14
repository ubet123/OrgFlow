import React from 'react';
import { useNavigate } from 'react-router-dom';
import ManagerTop from '../components/ManagerTop';
import TaskCreate from '../components/TaskCreate';
import TasksTable from '../components/TasksTable';
import Analytics from '../components/charts/Analytics';

const ManagerDash = ({ onLogout }) => {
    return (
        <div className="min-h-screen bg-neutral-950 text-neutral-300">
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