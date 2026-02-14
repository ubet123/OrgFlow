import { useEffect } from 'react';
import { useSocket } from './socketContext';
import useConversation from '../statemanagement/useConversation';
import sound from '../assets/notification.mp3';

const useGetSocketMessage = () => {
  const {socket} = useSocket();
  const { setMessages } = useConversation();


  useEffect(() => {

    if (socket) {
      const handleNewMessage = (newMessage) => {
        const notification = new Audio(sound);
        notification.play().catch((error) => {
          console.warn('Notification sound blocked:', error.message);
        });
        setMessages((prevMessages) => [...(Array.isArray(prevMessages) ? prevMessages : []), newMessage]);
      };
      socket.on('newMessage', handleNewMessage);
      return () => {
        socket.off('newMessage', handleNewMessage);
      };
    }
  }, [socket, setMessages]);
}

export default useGetSocketMessage;