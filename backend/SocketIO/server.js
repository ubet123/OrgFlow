const {Server} = require('socket.io');
const http = require('http');
const express = require('express');
const cors = require('cors');

const app = express();

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: ['http://localhost:5173',
  'https://org-flow-six.vercel.app',
  'https://orgflow-backend.onrender.com'],
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
        credentials: true
    }
}); 


//For Real-time messages
const getRecieverSocketId = (receiverId) => {
    return users[receiverId];
}

const users={};

io.on('connection', (socket) => {
    console.log('a user connected: ', socket.id);
    const userId = socket.handshake.query.userId;

    if(userId) {
        console.log('User ID from handshake query:', userId);
        users[userId] = socket.id;
    }
   
    io.emit('getOnline',Object.keys(users));

    socket.on('disconnect', () => {
        console.log('user disconnected: ', socket.id);
        delete users[userId];
        io.emit('getOnline',Object.keys(users));
    });

});


module.exports ={app,io,server,getRecieverSocketId};