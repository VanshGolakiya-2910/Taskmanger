import { useProject } from "../hooks/useProject";

const ProjectBoard = () => {
  const { projectId } = useProject();

  return (
    <div>
      <h3 className="text-lg font-medium">
        Kanban Board (Project {projectId})
      </h3>
    </div>
  );
};

export default ProjectBoard;
