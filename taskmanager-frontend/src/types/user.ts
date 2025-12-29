export type UserRole = "manager" | "project_manager" | "member";

export type User = {
  id: number;
  email: string;
  role: UserRole;
};
