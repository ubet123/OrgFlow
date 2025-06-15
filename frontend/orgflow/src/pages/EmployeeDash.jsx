import React from 'react'
import { useNavigate } from 'react-router-dom'
import EmployeeHeader from '../components/EmployeeHeader';
import EmployeeTask from '../components/EmployeeTask';

const EmployeeDash = ({ onLogout }) => {
    const navigate = useNavigate()
 
  const employee = JSON.parse(localStorage.getItem('userData'))
   console.log('current employee',employee);
   

    return (
        <div className="min-h-screen bg-neutral-950 text-neutral-300">
           <EmployeeHeader onLogout={onLogout} employee={employee}/>
           <EmployeeTask employee={employee} />
        </div>
    );
}

export default EmployeeDash