import type { TaskStatus } from "../../types/task";

export type KanbanColumn = {
  id: TaskStatus;
  label: string;
};

export const KANBAN_COLUMNS: KanbanColumn[] = [
  { id: "backlog", label: "Backlog" },
  { id: "todo", label: "To Do" },
  { id: "in_progress", label: "In Progress" },
  { id: "blocked", label: "Blocked" },
  { id: "in_review", label: "In Review" },
  { id: "done", label: "Done" },
];
