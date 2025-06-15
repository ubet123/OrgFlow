import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { v4 as uuidv4 } from 'uuid';

const EmployeeCreate = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Generate employee ID with EMP- prefix + 4 random chars
  const generateEmployeeId = () => `EMP-${uuidv4().substring(0, 4).toUpperCase()}`;

  const [employeeForm, setEmployeeForm] = useState({
    name: '',
    email: '',
    employeeId: generateEmployeeId(),
    password: '',
    role: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEmployeeForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    console.log('new employee',employeeForm);
    
  e.preventDefault();
  setIsSubmitting(true);

  try {
    const response = await axios.post('http://localhost:3001/user/create', {
      name: employeeForm.name,
      email: employeeForm.email,
      employeeId: employeeForm.employeeId,
      password: employeeForm.password,
      role: employeeForm.role
    });

    toast.success('Employee created successfully!', {
      position: "top-right",
      autoClose: 3000,
    });

    // Reset form
    setEmployeeForm({
      name: '',
      email: '',
      employeeId: generateEmployeeId(),
      password: '',
      role: ''
    });

  } catch (error) {
    console.error('Creation error:', error);
    toast.error(
      error.response?.data?.message || 
      error.message || 
      'Failed to create employee',
      {
        position: "top-right",
        autoClose: 5000,
      }
    );
  } finally {
    setIsSubmitting(false);
  }
};

  return (
   <div className="bg-neutral-900/80 backdrop-blur-sm rounded-xl border border-neutral-800 py-8 px-24 mt-20 mb-4 w-[82vw] max-w-[1800px] mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold text-emerald-400">Add New Employee</h2>
        <div className="text-md font-medium text-neutral-400">
          Employee ID: <span className="font-mono text-emerald-300 text-xl">{employeeForm.employeeId}</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Name */}
          <div>
            <label className="block text-md font-medium text-neutral-300 mb-2">Full Name*</label>
            <input
              type="text"
              name="name"
              value={employeeForm.name}
              onChange={handleInputChange}
              required
              className="w-full px-5 py-3 text-lg rounded-xl bg-neutral-800 border border-neutral-700 focus:outline-none focus:ring-2 focus:ring-emerald-700 text-white"
              placeholder="John Doe"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-md font-medium text-neutral-300 mb-2">Email*</label>
            <input
              type="email"
              name="email"
              value={employeeForm.email}
              onChange={handleInputChange}
              required
              className="w-full px-5 py-3 text-lg rounded-xl bg-neutral-800 border border-neutral-700 focus:outline-none focus:ring-2 focus:ring-emerald-700 text-white"
              placeholder="john@orgflow.com"
            />
          </div>

          {/* Role */}
        <div>
  <label className="block text-md font-medium text-neutral-300 mb-2">Role*</label>
  <input
    type="text"
    name="role"
    value={employeeForm.role}
    onChange={handleInputChange}
    required
    className="w-full px-5 py-3 text-lg rounded-xl bg-neutral-800 border border-neutral-700 focus:outline-none focus:ring-2 focus:ring-emerald-700 text-white"
    placeholder="Enter role (e.g. Developer)"
  />
</div>
          {/* Password */}
          <div>
            <label className="block text-md font-medium text-neutral-300 mb-2">Temporary Password*</label>
            <input
              type="password"
              name="password"
              value={employeeForm.password}
              onChange={handleInputChange}
              required
              minLength="6"
              className="w-full px-5 py-3 text-lg rounded-xl bg-neutral-800 border border-neutral-700 focus:outline-none focus:ring-2 focus:ring-emerald-700 text-white"
              placeholder="••••••••"
            />
            <p className="mt-1 text-xs text-neutral-500">Minimum 6 characters</p>
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`bg-emerald-700 hover:bg-emerald-800 text-white px-8 py-3.5 rounded-xl transition-colors font-medium flex items-center justify-center w-full text-lg ${
              isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
            }`}
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Creating...
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6z" />
                </svg>
                Create Employee
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EmployeeCreate;