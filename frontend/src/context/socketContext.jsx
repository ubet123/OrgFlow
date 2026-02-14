import React from 'react'
import { createContext, useEffect, useState, useContext } from 'react';
import useAuth from '../statemanagement/useAuth';
import io from 'socket.io-client';

const socketContext = createContext();

export  const  useSocket = () => {
    const context = useContext(socketContext);
    if (!context) {
        throw new Error("useSocket must be used within a SocketContextProvider");
    }
    return context;
};

export const SocketContextProvider = ({children}) => {
    const [socket, setSocket] = useState(null);
    const [onlineUsers, setOnlineUsers] = useState([]);
   const {user} = useAuth();

useEffect(() => {
  if (!user || !user._id) {
    setSocket(null);
    setOnlineUsers([]);
    return;
  }

  const nextSocket = io(import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001', {
    withCredentials: true,
    transports: ['websocket', 'polling'],
    query: {
      userId: user._id,
    }
  });
  setSocket(nextSocket);

  nextSocket.on('connect', () => {
    console.log('Socket connected:', nextSocket.id);
  });

  nextSocket.on('connect_error', (error) => {
    console.error('Socket connection error:', error.message);
  });

  nextSocket.on('getOnline', (onlineUsers) => {
    console.log('Online users:', onlineUsers);
    setOnlineUsers(onlineUsers);
  });

  return () => {
    nextSocket.off('getOnline');
    nextSocket.close();
  };
}, [user?._id]);

return (
    <socketContext.Provider value={{socket,onlineUsers}}>
        {children}
    </socketContext.Provider>
)


}

export default SocketContextProvider;