import React from 'react'
import { useNavigate } from 'react-router-dom'
import EmployeeHeader from '../components/EmployeeHeader';
import EmployeeTask from '../components/EmployeeTask';


const EmployeeDash = ({ onLogout, userData }) => {
    const navigate = useNavigate()

    // Debug: check what's actually being received
    console.log('EmployeeDash received userData:', userData)

    if (!userData) {
        return (
            <div className="min-h-screen bg-neutral-950 text-neutral-300">
                <p>Loading user data...</p>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-neutral-950 text-neutral-300">
           <EmployeeHeader 
               onLogout={onLogout} 
               employee={userData} 
           />
           <EmployeeTask 
               employee={userData} 
           />
        </div>
    )
}


export default EmployeeDash