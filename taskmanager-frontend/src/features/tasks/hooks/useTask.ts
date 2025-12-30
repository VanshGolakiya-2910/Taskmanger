import { useQuery } from "@tanstack/react-query";
import { getTaskById } from "../../../api/tasks.api";
import type { Task } from "../../../types/task";

export const useTask = (
  projectId: number,
  taskId: number
) => {
  return useQuery<Task>({
    queryKey: ["task", projectId, taskId],
    queryFn: () => getTaskById(projectId, taskId),
  });
};
