import { Routes, Route, Navigate } from "react-router-dom";
import AppLayout from "../components/layout/AppLayout";
import PageContainer from "../components/layout/PageContainer";
import ProtectedRoute from "./ProtectedRoute";
import Login from "../pages/auth/Login";
import ProjectList from "../pages/projects/ProjectList";
import ProjectDetails from "../pages/projects/ProjectDetails";

const Dashboard = () => (
  <PageContainer>
    <h1 className="text-2xl font-semibold">Dashboard</h1>
  </PageContainer>
);

export default function AppRoutes() {
  return (
    <Routes>
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
    </Routes>
  );
}
