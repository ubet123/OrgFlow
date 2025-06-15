import React from 'react'
import EmployeeCreate from '../components/EmployeeCreate'
import AllEmployees from '../components/AllEmployees'
import { useNavigate } from 'react-router-dom'
import { IoIosArrowBack } from "react-icons/io";

const CreateEmployee = () => {
    const navigate = useNavigate()
  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-300 pt-4"> 
   <div className="absolute top-0 right-0 my-5 mr-4">
  <button
    onClick={() => navigate('/manager-dashboard')}
    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg transition-all duration-200 flex items-center space-x-2"
  >
    <IoIosArrowBack className="text-lg" />
    <span>Back to Dashboard</span>
  </button>
</div>
      <EmployeeCreate/>
      <AllEmployees/>
    </div>
  )
}

export default CreateEmployee