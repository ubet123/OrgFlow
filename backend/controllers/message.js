const {Conversation} = require('../models/conversation');
const Message = require('../models/message.js');

exports.sendMessage = async (req, res) => {
    // console.log('message sent ');
    
    try {
        const { id: receiverId } = req.params;
        const { message: messageContent } = req.body;
        const senderId = req.user._id;  
     
        let conversation = await Conversation.findOne({
            participants: { $all: [senderId, receiverId] },
        });
        if (!conversation) {
            conversation = await Conversation.create({
                participants: [senderId, receiverId],
                
            });

            const newMessage = await Message.create({
                senderId,
                receiverId,
                message: messageContent,
            });


        if(newMessage){
           conversation.messages.push(newMessage._id);
            }
            await Promise.all([conversation.save(),newMessage.save()]);
        res.status(201).json({ message: 'Message sent successfully', data: newMessage });
    } }
    catch (error) {       
        console.error('Error sending message:', error);
        res.status(500).json({ message: 'Failed to send message', error: error.message });
    }
}; 



exports.getMessage = async (req, res) => {
    try {
        const { id: chatuser } = req.params;
        const senderId = req.user._id;

        const conversation = await Conversation.findOne({
            participants: { $all: [senderId, chatuser] },
        }).populate('messages');

        if(!conversation){
            return res.status(201).json({ message: 'No conversation found' });
        }

        const messages =  conversation.messages;
        res.status(200).json({ message: 'Messages retrieved successfully', messages });
        
    } catch (error) {
        console.error('Error retrieving messages:', error);
        res.status(500).json({ message: 'Failed to retrieve messages', error: error.message });
    }
}