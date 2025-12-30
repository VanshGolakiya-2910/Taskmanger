// src/api/comments.api.ts
import { api } from "./axios";

export const addComment = async (
  taskId: number,
  payload: { content: string }
) =>
  api.post(`/comments/task/${taskId}`, payload);

export const getTaskComments = async (
  projectId: number,
  taskId: number
): Promise<Comment[]> => {
  const res = await api.get(
    `/comments/projects/${projectId}/tasks/${taskId}/comments`
  );
  return res.data.data;
};
