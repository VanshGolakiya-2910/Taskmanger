import { useQuery } from "@tanstack/react-query";
import { getTaskComments } from "../../../api/comments.api";

export const useTaskComments = (
  projectId: number,
  taskId: number
) =>
  useQuery({
    queryKey: ["comments", projectId, taskId],
    queryFn: () => getTaskComments(projectId, taskId),
  });
