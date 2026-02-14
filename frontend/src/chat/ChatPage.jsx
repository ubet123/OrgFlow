import React, { useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import Left from "./left/left";
import Right from "./right/right";
import useConversation from "../statemanagement/useConversation";
import useAuth from "../statemanagement/useAuth";
import { useTheme } from "../context/themeContext";


export default function ChatPage() {
  const { userId } = useParams();
  const { setSelectedConversation } = useConversation();
  const { user } = useAuth();
  const { theme } = useTheme();
  const API_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';

  const pageStyles = theme === 'dark'
    ? 'bg-neutral-950 text-white'
    : 'bg-neutral-100 text-neutral-900';
  const ambientStyles = theme === 'dark'
    ? 'bg-[radial-gradient(circle_at_top_left,_rgba(16,185,129,0.12),_transparent_55%)]'
    : 'bg-[radial-gradient(circle_at_top_left,_rgba(16,185,129,0.18),_transparent_55%)]';

  useEffect(() => {
    const fetchSelectedUser = async () => {
      if (!userId) {
        setSelectedConversation(null);
        return;
      }

      try {
        const currentUserRole = user?.role;
        if (!currentUserRole) {
          return;
        }

        let users = [];
        if (currentUserRole === 'manager') {
          // Managers can fetch all employees
          const response = await axios.get(`${API_URL}/user/allemployees`, {
            withCredentials: true
          });
          users = response.data.users || response.data.employees || [];
        } else {
          // Non-managers (employees) can only fetch the manager
          const response = await axios.get(`${API_URL}/user/manager`, {
            withCredentials: true
          });
          users = response.data.manager ? [response.data.manager] : [];
        }

        const matchedUser = users.find((user) => user._id === userId) || null;
        setSelectedConversation(matchedUser);
      } catch (error) {
        console.error('Error fetching selected user:', error);
        setSelectedConversation(null);
      }
    };

    fetchSelectedUser();
  }, [API_URL, setSelectedConversation, userId, user?.role]);

  return (
    <div className={`h-screen ${pageStyles}`}>
      <div className={`h-full p-2 sm:p-3 lg:p-4 ${ambientStyles}`}>
        <div className="flex h-full gap-3 lg:gap-4">
          <div className={`${userId ? 'hidden md:block' : 'block'} w-full md:flex-none md:basis-[34%] lg:basis-[30%] xl:basis-[28%] md:min-w-[320px] md:shrink-0`}>
            <Left />
          </div>
          <div className={`${userId ? 'block' : 'hidden md:block'} flex-1 min-w-0`}>
            <Right />
          </div>
        </div>
      </div>
    </div>
  );
}