import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AllEmployees = () => {
  const [search, setSearch] = useState('');
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showConfirm, setShowConfirm] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState(null);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const response = await axios.get('http://localhost:3001/user/allemployees', {
        withCredentials: true // Add this to send cookies
      });
      setEmployees(response.data.users);
    } catch (error) {
      toast.error('Failed to fetch employees');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (employee) => {
    setEmployeeToDelete(employee);
    setShowConfirm(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await axios.delete(`http://localhost:3001/user/delete/${employeeToDelete._id}`, {
        withCredentials: true // Add this to send cookies
      });
      toast.success(`${employeeToDelete.name} deleted successfully`);
      fetchEmployees();
      setSearch('');
      setFilteredEmployees([]);
    } catch (error) {
      toast.error(`Failed to delete ${employeeToDelete.name}`);
      console.error('Error:', error);
    } finally {
      setShowConfirm(false);
      setEmployeeToDelete(null);
    }
  };

  const handleDeleteCancel = () => {
    setShowConfirm(false);
    setEmployeeToDelete(null);
  };

  const handleSearch = (e) => {
    const searchTerm = e.target.value.toLowerCase();
    setSearch(searchTerm);

    if (searchTerm === '') {
      setFilteredEmployees([]);
      return;
    }

    const results = employees.filter((employee) => {
      return (
        employee.name.toLowerCase().includes(searchTerm) ||
        employee.email.toLowerCase().includes(searchTerm) ||
        employee.employeeId.toLowerCase().includes(searchTerm) ||
        employee.role.toLowerCase().includes(searchTerm)
      );
    });

    setFilteredEmployees(results);
  };

  const clearSearch = () => {
    setSearch('');
    setFilteredEmployees([]);
  };

  const renderTableContent = () => {
    const dataToShow = search ? filteredEmployees : employees;

    if (loading) {
      return (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-emerald-500"></div>
        </div>
      );
    }

    if (search && filteredEmployees.length === 0) {
      return (
        <div className="text-center py-8 text-neutral-400">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-neutral-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="mt-2 text-lg">No employees found matching "{search}"</p>
          <button 
            onClick={clearSearch}
            className="mt-4 text-emerald-400 hover:text-emerald-300 flex items-center justify-center mx-auto"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
            Clear search
          </button>
        </div>
      );
    }

    if (dataToShow.length === 0) {
      return (
        <div className="text-center py-8 text-neutral-500">
          No employees found in the system
        </div>
      );
    }

    return (
      <>
        {/* Desktop Table */}
        <table className="w-full border-collapse hidden sm:table">
          <thead>
            <tr className="border-b border-neutral-700">
              <th className="py-3 px-2 sm:px-4 text-left text-sm sm:text-base text-neutral-300 font-medium">Employee ID</th>
              <th className="py-3 px-2 sm:px-4 text-left text-sm sm:text-base text-neutral-300 font-medium">Name</th>
              <th className="py-3 px-2 sm:px-4 text-left text-sm sm:text-base text-neutral-300 font-medium">Email</th>
              <th className="py-3 px-2 sm:px-4 text-left text-sm sm:text-base text-neutral-300 font-medium">Password</th>
              <th className="py-3 px-2 sm:px-4 text-left text-sm sm:text-base text-neutral-300 font-medium">Role</th>
              <th className="py-3 px-2 sm:px-4 text-left text-sm sm:text-base text-neutral-300 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {dataToShow.map((employee) => (
              <tr key={employee._id} className="border-b border-neutral-800 hover:bg-neutral-800/50 transition-colors">
                <td className="py-3 px-2 sm:px-4 text-sm sm:text-base text-neutral-200 font-mono">{employee.employeeId}</td>
                <td className="py-3 px-2 sm:px-4 text-sm sm:text-base text-neutral-200">{employee.name}</td>
                <td className="py-3 px-2 sm:px-4 text-sm sm:text-base text-neutral-200">{employee.email}</td>
                <td className="py-3 px-2 sm:px-4 text-xs sm:text-sm text-neutral-400 font-mono">
                  {employee.password}
                </td>
                <td className="py-3 px-2 sm:px-4">
                  <span className="px-3 py-1 rounded-full text-sm font-medium bg-emerald-900/30 text-emerald-200 border border-emerald-400/50 shadow-sm shadow-emerald-500/20">
                  {employee.role}
                  </span>
                </td>
                <td className="py-3 px-2 sm:px-4">
                  <button
                    onClick={() => handleDeleteClick(employee)}
                    className="text-red-400 hover:text-red-300 transition-colors flex items-center text-sm sm:text-base"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Mobile Cards */}
        <div className="sm:hidden space-y-4">
          {dataToShow.map((employee) => (
            <div key={employee._id} className="bg-neutral-800/50 rounded-lg p-4 border border-neutral-700">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-neutral-500">ID</p>
                  <p className="text-sm font-mono text-emerald-400">{employee.employeeId}</p>
                </div>
               
                <div className="col-span-2">
                  <p className="text-xs text-neutral-500">Name</p>
                  <p className="text-sm text-white">{employee.name}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-xs text-neutral-500">Email</p>
                  <p className="text-sm text-neutral-300">{employee.email}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-xs text-neutral-500">Password</p>
                  <p className="text-xs font-mono text-neutral-400">{employee.password}</p>
                </div>
                 <div className='flex items-center gap-2'>
                  <p className="text-xs text-neutral-500">Role</p>
                  <span className="whitespace-nowrap px-3 py-1 rounded-full text-xs font-medium bg-emerald-900/30 text-emerald-200 border border-emerald-400/50 shadow-sm shadow-emerald-500/20">
                  {employee.role}
                  </span>
                </div>
              </div>
              <div className="mt-4 flex justify-end">
                <button
                  onClick={() => handleDeleteClick(employee)}
                  className="text-red-400 hover:text-red-300 transition-colors flex items-center text-sm"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </>
    );
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-300 pt-12 px-4 pb-11">
      <div className="max-w-7xl mx-auto">
        <div className="bg-neutral-900/80 backdrop-blur-sm rounded-xl border border-neutral-800 p-4 sm:p-6 my-4 sm:my-6 overflow-x-auto">
          <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 gap-4'>
            <h2 className="text-xl sm:text-2xl font-semibold text-emerald-400">Employee Directory</h2>
            <div className="relative w-full sm:w-80">
              <input
                onChange={handleSearch}
                value={search}
                type="text"
                placeholder="Search employees..."
                className="w-full px-4 py-2 rounded-lg sm:rounded-xl bg-neutral-800 border-2 border-neutral-700 focus:outline-none focus:ring-2 focus:ring-emerald-600 text-white placeholder-neutral-500 transition-all duration-200 text-sm sm:text-base"
              />
              {search && (
                <button
                  onClick={clearSearch}
                  className="absolute right-3 top-2.5 text-neutral-400 hover:text-white"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </button>
              )}
            </div>
          </div>
          
          {renderTableContent()}
        </div>
      </div>

      {showConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-neutral-900/90 backdrop-blur-sm rounded-xl border border-neutral-800 p-4 sm:p-6 w-full max-w-md">
            <div className="flex items-start mb-4">
              <div className="bg-red-900/30 p-2 rounded-lg mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-1">Delete Employee</h3>
                <p className="text-sm sm:text-base text-neutral-400">
                  Are you sure you want to permanently delete <span className="font-medium text-white">{employeeToDelete?.name}</span>?
                </p>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 mt-4 sm:mt-6">
              <button
                onClick={handleDeleteCancel}
                className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg border border-neutral-700 text-neutral-300 hover:bg-neutral-800 transition-colors text-sm sm:text-base"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg bg-red-800 hover:bg-red-700 text-white transition-colors flex items-center text-sm sm:text-base"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllEmployees;