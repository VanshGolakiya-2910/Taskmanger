// src/api/files.api.ts
import { api } from "./axios";
import type { TaskFile } from "../types/file";

export const uploadProjectFile = async (
  projectId: number,
  file: File
) => {
  const formData = new FormData();
  formData.append("file", file);

  return api.post(
    `/files/projects/${projectId}/upload`,
    formData,
    { headers: { "Content-Type": "multipart/form-data" } }
  );
};

export const deleteFile = async (fileId: number) =>
  api.delete(`/files/${fileId}`);

export const getProjectFiles = async (
  projectId: number
): Promise<TaskFile[]> => {
  const res = await api.get(`/files/projects/${projectId}`);
  return res.data.data;
};