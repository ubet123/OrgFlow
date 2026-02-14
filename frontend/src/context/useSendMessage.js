import { useState } from 'react';
import axios from 'axios';
import useConversation from '../statemanagement/useConversation';

function useSendMessage() {
    const { messages, setMessages, selectedConversation } = useConversation();
    const [loading, setLoading] = useState(false);
    const API_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';

    const sendMessage = async (messageText) => {
        if (!selectedConversation || !selectedConversation._id) {
            return;
        }

        setLoading(true);
        try {
            const response = await axios.post(`${API_URL}/message/send/${selectedConversation._id}`,
                { message: messageText },
                { withCredentials: true }
            );
            const newMessage = response.data?.data;
            if (newMessage) {
                setMessages([...(Array.isArray(messages) ? messages : []), newMessage]);
            }
        } catch (error) {
            console.error('Error sending message:', error);
        } finally {
            setLoading(false);
        }
    };

    return { sendMessage, loading };
}

export default useSendMessage;