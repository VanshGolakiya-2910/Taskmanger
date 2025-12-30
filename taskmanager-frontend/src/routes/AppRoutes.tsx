import { Routes, Route, Navigate } from "react-router-dom";
import RequireAuth from "../auth/RequireAuth";
import PublicRoute from "../auth/PublicRoute";

import ProjectsList from "../features/projects/pages/ProjectsList";
import ProjectLayout from "../features/projects/pages/ProjectLayout";
import ProjectBoard from "../features/projects/pages/ProjectBoard";
import TaskDetailPage from "../features/tasks/pages/TaskDetailPage";

import LoginPage from "../auth/pages/LoginPage";
import SignupPage from "../auth/pages/SignupPage";

const AppRoutes = () => (
  <Routes>
    {/* PUBLIC ROUTES */}
    <Route
      path="/login"
      element={
        <PublicRoute>
          <LoginPage />
        </PublicRoute>
      }
    />
    <Route
      path="/signup"
      element={
        <PublicRoute>
          <SignupPage />
        </PublicRoute>
      }
    />

    {/* PROTECTED ROUTES */}
    <Route
      path="/projects"
      element={
        <RequireAuth>
          <ProjectsList />
        </RequireAuth>
      }
    />

    <Route
      path="/projects/:projectId"
      element={
        <RequireAuth>
          <ProjectLayout />
        </RequireAuth>
      }
    >
      <Route index element={<Navigate to="board" replace />} />
      <Route path="board" element={<ProjectBoard />} />
      <Route path="tasks/:taskId" element={<TaskDetailPage />} />
    </Route>

    {/* FALLBACK */}
    <Route path="*" element={<Navigate to="/projects" replace />} />
  </Routes>
);

export default AppRoutes;
