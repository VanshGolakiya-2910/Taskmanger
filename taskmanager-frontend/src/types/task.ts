/* ---------------- ENUMS (LOCKED FROM SRS) ---------------- */

export type TaskStatus =
  | "backlog"
  | "todo"
  | "in_progress"
  | "blocked"
  | "in_review"
  | "done";

export type TaskPriority =
  | "low"
  | "medium"
  | "high"
  | "critical";

/* ---------------- TASK MODEL ---------------- */

export type Task = {
  id: number;
  title: string;
  description?: string | null;

  status: TaskStatus;
  priority: TaskPriority;

  assignedTo: number;
  projectId: number;

  createdAt?: string;
  updatedAt?: string;
};
