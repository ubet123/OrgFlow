import React from 'react'
import { useNavigate } from 'react-router-dom'

const EmployeeDash = ({ onLogout }) => {
    const navigate = useNavigate()

    const handleLogOut = () => {
        localStorage.removeItem('userData')
        onLogout(); // Trigger re-render in App
        navigate('/login')
    }

    return (
        <>
            <h1>Employee Dashboard</h1>
            <button 
                onClick={handleLogOut} 
                className='text-white bg-red-500 rounded-lg'
            >
                LOGOUT
            </button>
        </>
    )
}

export default EmployeeDash