import pool from "../config/db.js";
import { canTransition, canManageTask, canUpdateStatus } from "../utils/taskRules.js";

export const createTaskService = async (user, data) => {
  if (!canManageTask(user.role)) {
    throw new Error("FORBIDDEN");
  }

  const [result] = await pool.query(
    `INSERT INTO tasks
     (title, description, assigned_to, project_id, created_by, due_date)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [
      data.title,
      data.description || null,
      data.assignedTo,
      data.projectId,
      user.id,
      data.dueDate || null,
    ]
  );

  await pool.query(
    `INSERT INTO task_history
     (task_id, action, new_value, changed_by)
     VALUES (?, 'created', 'backlog', ?)`,
    [result.insertId, user.id]
  );

  return { id: result.insertId };
};

export const updateTaskStatusService = async (user, taskId, newStatus) => {
  const [[task]] = await pool.query(
    "SELECT status, assigned_to FROM tasks WHERE id = ?",
    [taskId]
  );

  if (!task) throw new Error("TASK_NOT_FOUND");

  const isAssignee = task.assigned_to === user.id;

  if (!canUpdateStatus(user.role, isAssignee)) {
    throw new Error("FORBIDDEN");
  }

  if (!canTransition(task.status, newStatus) && !canManageTask(user.role)) {
    throw new Error("INVALID_TRANSITION");
  }

  await pool.query(
    "UPDATE tasks SET status = ? WHERE id = ?",
    [newStatus, taskId]
  );

  await pool.query(
    `INSERT INTO task_history
     (task_id, action, old_value, new_value, changed_by)
     VALUES (?, 'status_change', ?, ?, ?)`,
    [taskId, task.status, newStatus, user.id]
  );
};

export const deleteTaskService = async (user, taskId) => {
  if (!canManageTask(user.role)) {
    throw new Error("FORBIDDEN");
  }

  await pool.query("DELETE FROM tasks WHERE id = ?", [taskId]);
};
