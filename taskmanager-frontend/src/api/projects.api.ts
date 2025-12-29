// src/api/projects.api.ts
import { api } from "./axios";
import type { Project } from "../types/project";

export const createProject = async (payload: { name: string }) =>
  api.post("/projects", payload);

export const getMyProjects = async (): Promise<Project[]> => {
  const res = await api.get("/projects/my");
  return res.data.data;
};

export const getProjectById = async (projectId: number) => {
  const res = await api.get(`/projects/${projectId}`);
  return res.data.data;
};

export const getProjectMembers = async (projectId: number) =>
  api.get(`/projects/${projectId}/members`);

export const addProjectMember = async (
  projectId: number,
  payload: { userId: number; role: "member" | "project_manager" }
) =>
  api.post(`/projects/${projectId}/members`, payload);

export const removeProjectMember = async (
  projectId: number,
  userId: number
) =>
  api.delete(`/projects/${projectId}/members/${userId}`);

export const transferOwnership = async (
  projectId: number,
  payload: { newManagerId: number }
) =>
  api.post(`/projects/${projectId}/transfer`, payload);
