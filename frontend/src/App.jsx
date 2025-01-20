import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import TaskManager from './Pages/Taskmanger/TaskManger.jsx';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<TaskManager />} />
            </Routes>
        </Router>
    );
}

export default App;
