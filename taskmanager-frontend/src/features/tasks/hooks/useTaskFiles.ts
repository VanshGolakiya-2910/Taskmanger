import { useQuery } from "@tanstack/react-query";
import { getProjectFiles } from "../../../api/files.api";
import type { TaskFile } from "../../../types/file";

export const useTaskFiles = (projectId: number) =>
  useQuery<TaskFile[]>({
    queryKey: ["files", projectId],
    queryFn: () => getProjectFiles(projectId),
  });
