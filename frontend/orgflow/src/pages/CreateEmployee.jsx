import React from 'react'
import EmployeeCreate from '../components/EmployeeCreate'
import AllEmployees from '../components/AllEmployees'
import { useNavigate } from 'react-router-dom'
import { IoIosArrowBack } from "react-icons/io";

const CreateEmployee = () => {
    const navigate = useNavigate()
  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-300 pt-4"> 
   <div className="absolute top-0 right-0 mt-3 mr-2 sm:mt-4 sm:mr-3 md:mt-5 md:mr-4">
  <button
    onClick={() => navigate('/manager-dashboard')}
    className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 sm:px-4 sm:py-2.5 rounded-md sm:rounded-lg transition-all duration-200 flex items-center space-x-1 sm:space-x-2 text-sm sm:text-base"
  >
    <IoIosArrowBack className="text-base sm:text-lg" />
    <span className="hidden xs:inline">Back to Dashboard</span>
    <span className="xs:hidden">Back</span>
  </button>
</div>
      <EmployeeCreate/>
      <AllEmployees/>
    </div>
  )
}

export default CreateEmployee