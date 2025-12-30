export type TaskFile = {
  id: number;
  originalName: string;
  url: string;
  uploadedBy: number;
  projectId: number;
  taskId?: number | null;
  createdAt?: string;
};
