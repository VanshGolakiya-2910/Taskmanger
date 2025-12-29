export type ProjectRole = "manager" | "project_manager" | "member";

export type Project = {
  id: number;
  name: string;
  role: ProjectRole; // role of current user in this project
  createdAt?: string;
};
