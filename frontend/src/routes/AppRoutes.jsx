import { Routes, Route, Navigate } from 'react-router-dom'
import AppLayout from '../components/layout/AppLayout'
import ProtectedRoute from './ProtectedRoute.jsx'
import Login from '../pages/auth/Login'
import ProjectList from '../pages/projects/ProjectList'
import ProjectDetails from '../pages/projects/ProjectDetails'
import Dashboard from '../pages/dashboard/Dashboard'
import CreateTask from '../pages/tasks/CreateTask'
import TaskBoard from '../pages/tasks/TaskBoard'
import TaskDetails from '../pages/tasks/TaskDetails'
import Settings from '../pages/settings/Settings'
import Users from '../pages/settings/Users'

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="/login" element={<Login />} />

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
