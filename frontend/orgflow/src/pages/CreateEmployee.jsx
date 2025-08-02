import React from 'react'
import EmployeeCreate from '../components/EmployeeCreate'
import AllEmployees from '../components/AllEmployees'
import { useNavigate } from 'react-router-dom'
import { IoIosArrowBack } from "react-icons/io";

const CreateEmployee = () => {
    const navigate = useNavigate()
  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-300 pt-4"> 
   <div className="absolute top-0 right-0  mt-3 mr-2 sm:mt-4 sm:mr-3 md:mt-5  md:mr-4">
  <button
    onClick={() => navigate('/manager-dashboard')}
    
  >
     <div className="inline-block  px-5 py-2.5 text-base font-medium text-emerald-400 bg-neutral-900/70 border border-emerald-400/20 rounded-lg hover:bg-neutral-800/90 cursor-pointer">
      <div className="flex items-center justify-center gap-2 ">
        <span className="text-xl"><IoIosArrowBack /></span>
        <span>Back</span>
      </div>
    </div>
  </button>
</div>
      <EmployeeCreate/>
      <AllEmployees/>
    </div>
  )
}

export default CreateEmployee