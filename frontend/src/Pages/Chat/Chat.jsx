import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import { Card, CardHeader, CardTitle, CardContent } from '../../Components/ui/Card';
import Button from '../../Components/ui/Button';
import Input from '../../Components/ui/Input';
import { Send, Clock } from 'lucide-react';
import { useLocation } from 'react-router-dom'; // Import useLocation to get the passed email
import axios from 'axios';

const ChatComponent = () => {
  const [socket, setSocket] = useState(null); // WebSocket connection
  const [username, setUsername] = useState(''); // Current user's name
  const [messages, setMessages] = useState([]); // Chat messages
  const [message, setMessage] = useState(''); // Message input
  const [taskName, setTaskName] = useState('');
  console.log(taskName)
  // Retrieve email and taskId from location state passed by navigate
  const location = useLocation();
  const { email, taskId } = location.state || {}; // Access email and taskId passed from LoginSignup

  // Fetch Task Name
  useEffect(() => {
    if (taskId) {
      axios
        .get(`http://localhost:5000/api/task/task-name/${taskId}`)
        .then((response) => {
          setTaskName(response.data.taskName);
        })
        .catch((error) => {
          console.error('Error fetching task name:', error.message);
        });
    }
  }, [taskId]);

  // WebSocket connection setup
  useEffect(() => {
    if (!email) return; // Ensure email exists

    const newSocket = io('http://localhost:5000');
    setSocket(newSocket);

    newSocket.on('connect', () => {
      console.log('Connected to WebSocket server');
      newSocket.emit('set user', email); // Send email to the server for identification
    });

    newSocket.on('user set', (data) => {
      setUsername(data.username);
      console.log(`Welcome, ${data.username}`);
    });

    newSocket.on('chat message', (data) => {
      setMessages((prevMessages) => [
        ...prevMessages,
        { username: data.username, content: data.msg, timestamp: data.timestamp },
      ]);
    });

    newSocket.on('system message', (msg) => {
      setMessages((prevMessages) => [
        ...prevMessages,
        { username: 'System', content: msg, timestamp: new Date().toLocaleString() },
      ]);
    });

    newSocket.on('error', (error) => {
      console.error('WebSocket error:', error.message);
    });

    // Cleanup on component unmount
    return () => {
      newSocket.disconnect();
      console.log('Disconnected from WebSocket server');
    };
  }, [email]); // Depend on email to trigger WebSocket connection

  const handleSendMessage = () => {
    if (socket && message.trim()) {
      socket.emit('chat message', message);
      setMessages((prevMessages) => [
        ...prevMessages,
        { username, content: message, timestamp: new Date().toLocaleString() },
      ]);
      setMessage('');
    }
  };

  return (
    <div className="w-[85rem] h-[100%] bg-stone-100 p-8">
      <div className="max-w-4xl mx-auto">
        <Card className="bg-stone-50 h-[calc(100vh-6rem)]">
          <CardHeader className="border-b border-stone-200">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="font-serif text-amber-900">{taskName || 'Discussion'}</CardTitle>
                <p className="text-sm text-stone-600">Welcome, {username}</p>
              </div>
              <div className="flex items-center space-x-4">
                <Button variant="outline" className="border-amber-800 text-amber-800">
                  <Clock className="h-4 w-4 mr-2" />
                  View History
                </Button>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-0 flex flex-col h-[calc(100%-8rem)]">
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {messages.map((msg, index) => (
                <div key={index} className="flex space-x-4">
                  <div
                    className={`w-8 h-8 rounded-full ${msg.username === 'System' ? 'bg-gray-400' : 'bg-amber-800'} text-stone-50 flex items-center justify-center text-sm font-medium flex-shrink-0`}
                  >
                    {msg.username[0]}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium text-stone-900">{msg.username}</h3>
                      <span className="text-sm text-stone-500">{msg.timestamp}</span>
                    </div>
                    <p className="text-stone-600 mt-1">{msg.content}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 border-t border-stone-200">
              <div className="flex space-x-4">
                <Input
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Compose your message..."
                  className="flex-1"
                />
                <Button onClick={handleSendMessage} className="bg-amber-800 hover:bg-amber-900">
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ChatComponent;
