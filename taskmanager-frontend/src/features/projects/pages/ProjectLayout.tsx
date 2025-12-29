import { Outlet } from "react-router-dom";
import { useProject } from "../hooks/useProject";
import ProjectHeader from "../components/ProjectHeader";
import { useProjectSocket } from "../../../sockets/useProjectSocket";

const ProjectLayout = () => {
  const { projectId } = useProject();

  // 🔌 socket lifecycle bound here
  useProjectSocket(projectId);

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
