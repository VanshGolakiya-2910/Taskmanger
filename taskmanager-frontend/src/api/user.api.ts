// src/api/users.api.ts
import { api } from "./axios";
import type { User } from "../types/user";

export const getAllUsers = async (): Promise<User[]> => {
  const res = await api.get("/users");
  return res.data.data;
};
