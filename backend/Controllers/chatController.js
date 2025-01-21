const db = require('../db');  // Adjust the path if necessary
const users = {};
const getUserDetailsFromDB = async (Email) => {
    console.log(`Fetching user details for email: ${Email}`);
    return new Promise((resolve, reject) => {
        if (!Email) {
            return reject(new Error("Invalid email provided"));
        }

        const query = 'SELECT User_ID, User_Name, Task_ID FROM user WHERE Email = ?';

        db.query(query, [Email], (err, results) => {
            if (err) {
                console.error('Error fetching user details:', err.message);
                return reject(new Error('Error fetching user details'));
            }
            if (results.length > 0) {
                console.log('User details found:', results[0]);
                resolve(results[0]);
            } else {
                console.log('No user found for email:', Email);
                reject(new Error('User not found'));
            }
        });
    });
};



const handleConnection = (socket) => {
    console.log('A user connected');

    // Listen for the 'set user' event, where the client sends an Email
    socket.on('set user', async (Email) => {
        console.log(`Received Email: ${Email}`);

        if (typeof Email !== 'string') {
            return socket.emit('error', { message: 'Invalid email format' });
        }

        try {
            const userDetails = await getUserDetailsFromDB(Email);
            users[socket.id] = { Email, username: userDetails.User_Name, userId: userDetails.User_ID };
            console.log(`${userDetails.User_Name} has joined the chat`);
            socket.emit('user set', { username: userDetails.User_Name });
        } catch (error) {
            console.error('Error setting user:', error.message);
            socket.emit('error', { message: 'Failed to set user' });
        }
    });

    socket.on('chat message', async (msg) => {
        const user = users[socket.id];
        if (user) {
            try {
                const userDetails = await getUserDetailsFromDB(user.Email);

                const timestamp = new Date();

                const query = `
                INSERT INTO messages (Task_ID, timestamp, messages, User_ID, User_Name)
                VALUES (?, ?, ?, ?, ?)
                `;
                db.query(query, [
                    userDetails.Task_ID,
                    timestamp,
                    msg,
                    userDetails.User_ID,
                    user.username
                ], (err) => {
                    if (err) {
                        console.error('Error saving message:', err.message);
                        socket.emit('error', { message: 'Failed to save message' });
                        return;
                    }
                    console.log(`Message saved: ${msg} from ${user.username}`);
                    socket.broadcast.emit('chat message', { username: user.username, msg });
                });
            } catch (error) {
                console.error('Error fetching user details:', error.message);
                socket.emit('error', { message: 'Failed to fetch user details' });
            }
        } else {
            socket.emit('error', { message: 'User not authenticated' });
        }
    });



    socket.on('disconnect', () => {
        const user = users[socket.id];
        if (user) {
            console.log(`${user.username} has left the chat`);
            delete users[socket.id];
        } else {
            console.log('An unauthenticated user disconnected');
        }
    });
};

module.exports = { handleConnection };

