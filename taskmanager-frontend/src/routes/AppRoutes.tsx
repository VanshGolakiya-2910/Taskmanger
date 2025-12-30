import { Routes, Route, Navigate } from "react-router-dom";
import RequireAuth from "../auth/RequireAuth";
import ProjectsList from "../features/projects/pages/ProjectsList";
import ProjectLayout from "../features/projects/pages/ProjectLayout";
import ProjectBoard from "../features/projects/pages/ProjectBoard";
import TaskDetailPage from "../features/tasks/pages/TaskDetailPage";

const AppRoutes = () => (
  <Routes>
    <Route path="/login" element={<div>Login</div>} />

    {/* Projects root */}
    <Route
      path="/projects"
      element={
        <RequireAuth>
          <ProjectsList />
        </RequireAuth>
      }
    />

    {/* Project-scoped routes */}
    <Route
      path="/projects/:projectId"
      element={
        <RequireAuth>
          <ProjectLayout />
        </RequireAuth>
      }
    >
      <Route path="board" element={<ProjectBoard />} />
    </Route>

    <Route path="*" element={<Navigate to="/projects" replace />} />

    <Route
      path="/projects/:projectId/tasks/:taskId"
      element={
        <RequireAuth>
          <TaskDetailPage />
        </RequireAuth>
      }
    />
  </Routes>
);

export default AppRoutes;
