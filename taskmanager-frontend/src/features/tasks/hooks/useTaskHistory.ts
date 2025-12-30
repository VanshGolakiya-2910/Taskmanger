import { useQuery } from "@tanstack/react-query";
import { getTaskHistory } from "../../../api/task-history.api";
import type { TaskHistoryEntry } from "../../../types/task-history";

export const useTaskHistory = (taskId: number) =>
  useQuery<TaskHistoryEntry[]>({
    queryKey: ["task-history", taskId],
    queryFn: () => getTaskHistory(taskId),
  });
