import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { useTheme } from '../../context/themeContext';

const User = ({ searchTerm = '', onUserSelect }) => {
  const { theme } = useTheme();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const API_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`${API_URL}/user/allemployees`, {
          withCredentials: true
        });

        const rawUsers = response.data.users || response.data.employees || [];
        const filteredUsers = rawUsers.filter((user) => user.role !== 'manager');
        setUsers(filteredUsers);
      } catch (err) {
        console.error('Error fetching users:', err);
        setError('Failed to load users');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [API_URL]);

  const cardHover = theme === 'dark' ? 'hover:bg-neutral-800/60' : 'hover:bg-neutral-300';
  const avatarStyles = theme === 'dark'
    ? 'bg-neutral-700 text-white'
    : 'bg-emerald-100 text-emerald-700';
  const nameStyles = theme === 'dark' ? 'text-white' : 'text-neutral-900';
  const subTextStyles = theme === 'dark' ? 'text-neutral-400' : 'text-neutral-500';
  const statusBorder = theme === 'dark' ? 'border-black' : 'border-white';

  const filteredUsers = useMemo(() => {
    const normalized = searchTerm.trim().toLowerCase();
    if (!normalized) {
      return users;
    }

    return users.filter((user) => {
      const nameMatch = user.name?.toLowerCase().includes(normalized);
      const employeeMatch = user.employeeId?.toLowerCase().includes(normalized);
      const emailMatch = user.email?.toLowerCase().includes(normalized);
      return nameMatch || employeeMatch || emailMatch;
    });
  }, [searchTerm, users]);

  const userCards = useMemo(() => {
    return filteredUsers.map((user) => {
      const initials = user.name
        ? user.name
            .split(' ')
            .filter(Boolean)
            .slice(0, 2)
            .map((part) => part[0].toUpperCase())
            .join('')
        : 'U';

      return (
        <div
          onClick={() => onUserSelect?.(user)}
          key={user._id}
          className={`flex items-center gap-3 px-3 py-4 cursor-pointer ${cardHover}`}
        >
          <div className="relative">
            <div className={`h-11 w-11 rounded-full flex items-center justify-center text-sm font-semibold ${avatarStyles}`}>
              {initials}
            </div>
            <span className={`absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full bg-emerald-500 border-2 ${statusBorder}`} />
          </div>
          <div className="leading-tight">
            <p className={`text-sm font-semibold ${nameStyles}`}>{user.name}</p>
            <p className={`text-xs ${subTextStyles}`}>Online</p>
          </div>
        </div>
      );
    });
  }, [filteredUsers, avatarStyles, cardHover, nameStyles, statusBorder, subTextStyles]);

  if (loading) {
    return <div className={`px-3 py-4 text-sm ${subTextStyles}`}>Loading users...</div>;
  }

  if (error) {
    return <div className={`px-3 py-4 text-sm ${theme === 'dark' ? 'text-red-300' : 'text-red-600'}`}>{error}</div>;
  }

  if (users.length === 0) {
    return <div className={`px-3 py-4 text-sm ${subTextStyles}`}>No users found.</div>;
  }

  if (filteredUsers.length === 0) {
    return <div className={`px-3 py-4 text-sm ${subTextStyles}`}>No matches found.</div>;
  }

  return <div className="flex flex-col">{userCards}</div>;
};

export default User;