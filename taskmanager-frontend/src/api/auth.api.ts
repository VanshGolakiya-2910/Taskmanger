// src/api/auth.api.ts
import { api } from "./axios";

export const login = async (payload: {
  email: string;
  password: string;
}) => api.post("/auth/login", payload);

export const register = async (payload: {
  email: string;
  password: string;
  role: "manager" | "project_manager" | "member";
}) => api.post("/auth/register", payload);

export const refreshToken = async () =>
  api.post("/auth/refresh");

export const logout = async () =>
  api.post("/auth/logout");


