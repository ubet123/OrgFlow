import React from 'react'
import EmployeeCreate from '../components/EmployeeCreate'
import AllEmployees from '../components/AllEmployees'
import { useNavigate } from 'react-router-dom'
import { IoIosArrowBack } from "react-icons/io";
import { useTheme } from '../context/themeContext';

const CreateEmployee = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();

  // Custom styles for theme
  const containerStyles = theme === 'dark'
    ? 'bg-neutral-950 text-neutral-300'
    : 'bg-neutral-50 text-neutral-800';

  const backButtonStyles = theme === 'dark'
    ? 'text-emerald-400 bg-neutral-900/70 border border-emerald-400/20 hover:bg-neutral-800/90'
    : 'text-emerald-600 bg-white border border-emerald-300 hover:bg-neutral-100';

  return (
    <div className={`min-h-screen pt-4 ${containerStyles}`}>
      {/* Back Button */}
      <div className="absolute top-0 right-0 mt-3 mr-2 sm:mt-4 sm:mr-3 md:mt-5 md:mr-4">
        <button onClick={() => navigate('/manager-dashboard')}>
          <div className={`inline-block px-5 py-2.5 text-base font-medium rounded-lg cursor-pointer transition-colors duration-200 ${backButtonStyles}`}>
            <div className="flex items-center justify-center gap-2">
              <span className="text-xl"><IoIosArrowBack /></span>
              <span>Back</span>
            </div>
          </div>
        </button>
      </div>

      {/* Components */}
      <EmployeeCreate />
      <AllEmployees />
    </div>
  )
}

export default CreateEmployee;
