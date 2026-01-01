import pool from "../config/db.js";
import { ApiError } from "../utils/ApiError.js";
import {
  canTransition,
  canManageTask,
  canUpdateStatus,
} from "../utils/taskRules.js";
import { emitToProject } from "../realtime/events.js";

export const updateTaskStatusService = async (user, taskId, newStatus) => {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    const [[task]] = await conn.query(
      "SELECT status, assigned_to, project_id FROM tasks WHERE id = ?",
      [taskId]
    );

    if (!task) throw new ApiError(404, "Task not found");

    const isAssignee = task.assigned_to === user.id;
    if (!canUpdateStatus(user.role, isAssignee)) {
      throw new ApiError(403, "Forbidden");
    }

    if (!canTransition(task.status, newStatus) && !canManageTask(user.role)) {
      throw new ApiError(400, "Invalid status transition");
    }

    await conn.query(
      "UPDATE tasks SET status = ? WHERE id = ?",
      [newStatus, taskId]
    );

    await conn.query(
      `INSERT INTO task_history
       (task_id, action, old_value, new_value, changed_by)
       VALUES (?, 'status_change', ?, ?, ?)`,
      [taskId, task.status, newStatus, user.id]
    );

    await conn.commit();

    emitToProject(task.project_id, "task:status_updated", {
      taskId,
      oldStatus: task.status,
      newStatus,
    });

    return task.project_id;
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }
};


export const deleteTaskService = async (user, taskId) => {
  if (!canManageTask(user.role)) {
    throw new Error("FORBIDDEN");
  }

  const [[task]] = await pool.query(
    "SELECT project_id FROM tasks WHERE id = ?",
    [taskId]
  );

  if (!task) {
    throw new ApiError(404, "Task not found");
  }

  await pool.query("DELETE FROM tasks WHERE id = ?", [taskId]);

  return task.project_id;
};

export const createTaskService = async (user, project, data) => {
  if (!canManageTask(user.role)) {
    throw new ApiError(403, "Forbidden");
  }

  if (!data.title || !data.assignedTo) {
    throw new ApiError(400, "INVALID_TASK_DATA");
  }

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    const [result] = await conn.query(
      `
      INSERT INTO tasks
      (title, description, assigned_to, project_id, created_by, due_date)
      VALUES (?, ?, ?, ?, ?, ?)
      `,
      [
        data.title,
        data.description || null,
        data.assignedTo,
        project.id, 
        user.id,
        data.dueDate || null
      ]
    );

    await conn.query(
      `
      INSERT INTO task_history
      (task_id, action, new_value, changed_by)
      VALUES (?, 'created', 'backlog', ?)
      `,
      [result.insertId, user.id]
    );

    await conn.commit();

    return { id: result.insertId };
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }
};

export const getAllProjectTasksService = async (user, project) => {
  // All project members can view tasks
  const [tasks] = await pool.query(
    `
    SELECT *
    FROM tasks
    WHERE project_id = ?
    ORDER BY created_at DESC
    `,
    [project.id]
  );

  return tasks;
};

export const getMyAssignedTasksService = async (user, project) => {
  const [tasks] = await pool.query(
    `
    SELECT *
    FROM tasks
    WHERE project_id = ?
      AND assigned_to = ?
    ORDER BY created_at DESC
    `,
    [project.id, user.id]
  );

  return tasks;
};

export const getTaskByIdService = async (user, project, taskId) => {
  const [[task]] = await pool.query(
    `
    SELECT *
    FROM tasks
    WHERE id = ?
      AND project_id = ?
    `,
    [taskId, project.id]
  );

  if (!task) {
    throw new ApiError(404, "Task not found");
  }

  return task;
};

