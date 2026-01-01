import { Routes, Route, Navigate } from 'react-router-dom'
import AppLayout from '../components/layout/AppLayout'
import ProtectedRoute from './ProtectedRoute.jsx'
import Login from '../pages/auth/Login.jsx'
import ForgotPassword from '../pages/auth/ForgotPassword.jsx'
import ResetPassword from '../pages/auth/ResetPassword.jsx'
import ProjectList from '../pages/projects/ProjectList'
import ProjectDetails from '../pages/projects/ProjectDetails'
import ProjectMembers from '../pages/projects/ProjectMembers'
import Dashboard from '../pages/dashboard/Dashboard'
import CreateTask from '../pages/tasks/CreateTask'
import TaskBoard from '../pages/tasks/TaskBoard'
import TaskDetails from '../pages/tasks/TaskDetails'
import Settings from '../pages/settings/Settings'
import Users from '../pages/settings/Users'
import ChatPage from '../pages/chat/ChatPage'

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <AppLayout>
              <Dashboard />
            </AppLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/projects"
        element={
          <ProtectedRoute>
            <AppLayout>
              <ProjectList />
            </AppLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/projects/:projectId"
        element={
          <ProtectedRoute>
            <AppLayout>
              <ProjectDetails />
            </AppLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/projects/:projectId/chat"
        element={
          <ProtectedRoute>
            <AppLayout>
              <ChatPage />
            </AppLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/projects/:projectId/members"
        element={
          <ProtectedRoute>
            <AppLayout>
              <ProjectMembers />
            </AppLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/projects/:projectId/tasks"
        element={
          <ProtectedRoute>
            <AppLayout>
              <TaskBoard />
            </AppLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/projects/:projectId/tasks/:taskId"
        element={
          <ProtectedRoute>
            <AppLayout>
              <TaskDetails />
            </AppLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/tasks/new"
        element={
          <ProtectedRoute>
            <AppLayout>
              <CreateTask />
            </AppLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <AppLayout>
              <Settings />
            </AppLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/users"
        element={
          <ProtectedRoute>
            <AppLayout>
              <Users />
            </AppLayout>
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  )
}
