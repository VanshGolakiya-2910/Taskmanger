import { useParams } from "react-router-dom";

export const useProject = () => {
  const { projectId } = useParams();

  if (!projectId) {
    throw new Error("Project ID missing in route");
  }

  return {
    projectId: Number(projectId),
  };
};
