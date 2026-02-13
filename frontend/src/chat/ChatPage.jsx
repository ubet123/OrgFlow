import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import Left from "./left/left";
import Right from "./right/right";


export default function ChatPage() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [selectedUser, setSelectedUser] = useState(null);
  const API_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';

  useEffect(() => {
    const fetchSelectedUser = async () => {
      if (!userId) {
        setSelectedUser(null);
        return;
      }

      try {
        const response = await axios.get(`${API_URL}/user/allemployees`, {
          withCredentials: true
        });

        const rawUsers = response.data.users || response.data.employees || [];
        const filteredUsers = rawUsers.filter((user) => user.role !== 'manager');
        const matchedUser = filteredUsers.find((user) => user._id === userId) || null;
        setSelectedUser(matchedUser);
      } catch (error) {
        setSelectedUser(null);
      }
    };

    fetchSelectedUser();
  }, [API_URL, userId]);

  const handleUserSelect = (user) => {
    if (!user?._id) {
      return;
    }

    setSelectedUser(user);
    navigate(`/chat/${user._id}`);
  };

  return (
    <>
      <div className="flex h-screen">
        <Left onUserSelect={handleUserSelect} />
        <Right selectedUser={selectedUser} />   
      </div>
    </>
  );
}