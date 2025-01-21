import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import TaskManager from './Components/Taskmanger/TaskManger.jsx';
import LoginSignup from './Pages/LoginSignup/LoginSignup.jsx';
import Homepage from './Pages/Home/Home.jsx';
import Projects from './Pages/Project/Project.jsx';
import ProjectDetails from './Pages/ProjectDetails/ProjectDetails.jsx';
import Chat from './Pages/Chat/Chat.jsx';
// import Dashboard from './Pages/Dashboard/Dashboard.jsx'; // Example for a dashboard page

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<LoginSignup />} /> {/* Default route to LoginSignup */}
                <Route path="/task-manager" element={<TaskManager />} />
                <Route path="/home" element={<Homepage />} />
                <Route path="/chat" element ={<Chat />} />
                <Route path="/project" element={<Projects />} />
                <Route path="/project/:id" element={<ProjectDetails />} />
                {/* <Route path="/dashboard" element={<Dashboard />} /> Example Dashboard */}
                {/* Add more routes as needed */}
            </Routes>
        </Router>
    );
}

export default App;
