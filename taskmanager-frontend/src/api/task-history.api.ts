import { api } from "./axios";
import type { TaskHistoryEntry } from "../types/task-history";

export const getTaskHistory = async (
  taskId: number
): Promise<TaskHistoryEntry[]> => {
  const res = await api.get(`/tasks/${taskId}/history`);
  return res.data.data;
};
