import { Outlet } from "react-router-dom";
import { useProject } from "../hooks/useProject";
import ProjectHeader from "../components/ProjectHeader";

const ProjectLayout = () => {
  const { projectId } = useProject();

  return (
    <div className="min-h-screen flex flex-col">
      <ProjectHeader projectId={projectId} />
      <main className="flex-1 p-4">
        <Outlet />
      </main>
    </div>
  );
};

export default ProjectLayout;
