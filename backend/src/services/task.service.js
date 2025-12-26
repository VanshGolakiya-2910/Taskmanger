import pool from "../config/db.js";
import {
  canTransition,
  canManageTask,
  canUpdateStatus,
} from "../utils/taskRules.js";
import { emitToProject } from "../realtime/events.js";

export const updateTaskStatusService = async (user, taskId, newStatus) => {
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    const [[task]] = await connection.query(
      `SELECT status, assigned_to, project_id
       FROM tasks
       WHERE id = ?`,
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

    await connection.query(
      "UPDATE tasks SET status = ? WHERE id = ?",
      [newStatus, taskId]
    );

    await connection.query(
      `INSERT INTO task_history
       (task_id, action, old_value, new_value, changed_by)
       VALUES (?, 'status_change', ?, ?, ?)`,
      [taskId, task.status, newStatus, user.id]
    );

    await connection.commit();
    
    emitToProject(task.project_id, "task:status_updated", {
      taskId,
      oldStatus: task.status,
      newStatus,
    });

  } catch (err) {
    await connection.rollback();
    throw err;
  } finally {
    connection.release();
  }
};

export const deleteTaskService = async (user, taskId) => {
  if (!canManageTask(user.role)) {
    throw new Error("FORBIDDEN");
  }

  await pool.query("DELETE FROM tasks WHERE id = ?", [taskId]);
};

