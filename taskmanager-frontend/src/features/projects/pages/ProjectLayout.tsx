import { Outlet } from "react-router-dom";
import { useProject } from "../hooks/useProject";
import ProjectHeader from "../components/ProjectHeader";
import { useProjectSocket } from "../../../sockets/useProjectSocket";
import { useSocketInvalidation } from "../../../sockets/useSocketInvalidation";

const ProjectLayout = () => {
  const { projectId } = useProject();

  useProjectSocket(projectId);
  useSocketInvalidation();  

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
