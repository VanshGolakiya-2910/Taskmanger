import type { Task, TaskStatus } from "../../types/task";

export const groupTasksByStatus = (
  tasks: Task[]
): Record<TaskStatus, Task[]> => {
  return tasks.reduce((acc: Record<TaskStatus, Task[]>, task) => {
    acc[task.status].push(task);
    return acc;
  }, {
    backlog: [],
    todo: [],
    in_progress: [],
    blocked: [],
    in_review: [],
    done: [],
  });
};
