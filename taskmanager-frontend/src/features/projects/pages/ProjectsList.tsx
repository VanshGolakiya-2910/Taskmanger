import { useQuery } from "@tanstack/react-query";
import { getMyProjects } from "../../../api/projects.api";
import { Link } from "react-router-dom";
import type { Project } from "../../../types/project";

const ProjectsList = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["projects", "my"],
    queryFn: getMyProjects,
  });

  if (isLoading) return <div className="p-4">Loading projects...</div>;
  if (error) return <div className="p-4 text-red-500">Failed to load projects</div>;
  if (!data || data.length === 0)
    return <div className="p-4">No projects found</div>;

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-xl font-semibold">My Projects</h1>

      <ul className="space-y-2">
        {data.map((project: Project) => (
          <li key={project.id} className="border rounded p-3 hover:bg-slate-50">
            <Link
              to={`/projects/${project.id}/board`}
              className="flex justify-between"
            >
              <span>{project.name}</span>
              <span className="text-sm text-slate-500">{project.role}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProjectsList;
