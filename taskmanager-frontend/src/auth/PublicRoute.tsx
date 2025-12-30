import { Navigate } from "react-router-dom";
import { useAuth } from "./hooks/useAuth";
import type { ReactNode } from "react";

const PublicRoute = ({ children }: { children: ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) return <div className="p-4">Loading...</div>;

  if (isAuthenticated) {
    return <Navigate to="/projects" replace />;
  }

  return <>{children}</>;
};

export default PublicRoute;
