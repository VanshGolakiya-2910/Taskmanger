export type ProjectRole = "manager" | "project_manager" | "member";

export type Project = {
  id: number;
  name: string;
  role: ProjectRole; 
  createdAt?: string;
};
