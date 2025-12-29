// src/api/tasks.api.ts
import { api } from "./axios";
import type { Task } from "../types/task";

export const createTask = async (
  projectId: number,
  payload: {
    title: string;
    description?: string;
    assignedTo: number;
    dueDate?: string | null;
  }
) =>
  api.post(`/tasks/project/${projectId}`, payload);

export const getProjectTasks = async (
  projectId: number
): Promise<Task[]> => {
  const res = await api.get(`/tasks/project/${projectId}`);
  return res.data.data;
};

export const getMyTasks = async (projectId: number) =>
  api.get(`/tasks/project/${projectId}/my`);

export const getTaskById = async (
  projectId: number,
  taskId: number
) =>
  api.get(`/tasks/project/${projectId}/${taskId}`);

export const updateTaskStatus = async (
  projectId: number,
  taskId: number,
  payload: { status: string }
) =>
  api.patch(
    `/tasks/project/${projectId}/${taskId}/status`,
    payload
  );

export const deleteTask = async (
  projectId: number,
  taskId: number
) =>
  api.delete(`/tasks/project/${projectId}/${taskId}`);
