import React from 'react'
import { useNavigate } from 'react-router-dom'
import EmployeeHeader from '../components/EmployeeHeader';
import EmployeeTask from '../components/EmployeeTask';
import EmployeeStats from '../components/EmployeeStats';
import { useTheme } from '../context/themeContext';


const EmployeeDash = ({ onLogout, userData }) => {
    const navigate = useNavigate()
    const { theme } = useTheme();

    const pageBg = theme === 'dark' ? 'bg-neutral-950 text-neutral-300' : 'bg-neutral-50 text-neutral-800';

    
    // console.log('EmployeeDash received userData:', userData)

    if (!userData) {
        return (
            <div className={`min-h-screen ${pageBg}`}>
                <p>Loading user data...</p>
            </div>
        )
    }

    return (
        <div className={`min-h-screen ${pageBg}`}>
           <EmployeeHeader 
               onLogout={onLogout} 
               employee={userData} 
           />
           <EmployeeStats />
           <EmployeeTask 
               employee={userData} 
           />
        </div>
    )
}


export default EmployeeDash