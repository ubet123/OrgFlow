import { useEffect, useState } from 'react';
import axios from 'axios';
import useConversation from '../statemanagement/useConversation';

function useGetMessage() {
    const { messages, setMessages, selectedConversation } = useConversation();
    const [loading, setLoading] = useState(false);
    const API_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';



    useEffect(() => {
        const getMessages = async () => {
            setLoading(true);
            if (selectedConversation && selectedConversation._id) {
                try {
                    const response = await axios.get(`${API_URL}/message/get/${selectedConversation._id}`, {
                        withCredentials: true
                    });
                    const nextMessages = Array.isArray(response.data.messages)
                        ? response.data.messages
                        : [];
                    setMessages(nextMessages);
                } catch (error) {
                    console.error('Error fetching messages:', error);
                } finally {
                    setLoading(false);
                }
            } else {
                setMessages([]);
                setLoading(false);
            }
        };

        getMessages();
    }, [API_URL, selectedConversation?._id, setMessages]);

    return { messages, loading };
}

export default useGetMessage;