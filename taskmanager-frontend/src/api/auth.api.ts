import { api } from "./axios";
import type { User } from "../types/user";


export const getCurrentUser = async (): Promise<User> => {
  const res = await api.get("/users/me");
  return res.data.data;
};
