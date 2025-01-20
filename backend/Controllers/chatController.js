const socketIo = require('socket.io');
const express = require('express');
const db = require('../db');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);


io.on('connection', (socket) => {
    console.log('a user connected');

    socket.on('set username', (username) => {
        users[socket.id] = username;
        console.log(`${username} has joined the chat`);
    });

    socket.on('chat message', (msg) => {
        const username = users[socket.id];
        if (username) {
            const timestamp = new Date();
            const query = 'INSERT INTO messages (User_Name, messages, timestamp) VALUES (?, ?, ?)';
            db.query(query, [username, msg, timestamp], (err, result) => {
                if (err) {
                    console.error('Error saving message:', err);
                    return;
                }
                console.log('Message saved to the database');
            });
            io.emit('chat message', username, msg);
        }
    });

    socket.on('disconnect', () => {
        console.log('user disconnected');
        if (users[socket.id]) {
            console.log(`${users[socket.id]} left the chat`);
            delete users[socket.id];
        }
    });
});
