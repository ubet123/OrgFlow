import React, { useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import Left from "./left/left";
import Right from "./right/right";
import useConversation from "../statemanagement/useConversation";
import useAuth from "../statemanagement/useAuth";


export default function ChatPage() {
  const { userId } = useParams();
  const { setSelectedConversation } = useConversation();
  const { user } = useAuth();
  const API_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';

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
    <>
      <div className="flex h-screen">
        <Left />
        <Right />   
      </div>
    </>
  );
}