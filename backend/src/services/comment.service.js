import pool from "../config/db.js";
import { emitCommentCreated } from "../utils/commentEvents.js";

export const createCommentService = async ({ user, taskId, content }) => {
  // Verify task exists and get project scope
  const [[task]] = await pool.query(
    "SELECT project_id FROM tasks WHERE id = ?",
    [taskId]
  );

  if (!task) throw new Error("TASK_NOT_FOUND");

  // Ensure user is a member of the project
  const [[member]] = await pool.query(
    `SELECT 1 FROM project_members
     WHERE project_id = ? AND user_id = ?`,
    [task.project_id, user.id]
  );

  if (!member) throw new Error("FORBIDDEN");

  const [result] = await pool.query(
    `INSERT INTO comments (task_id, user_id, content)
     VALUES (?, ?, ?)`,
    [taskId, user.id, content]
  );

  const comment = {
    id: result.insertId,
    taskId,
    userId: user.id,
    content,
  };

  emitCommentCreated({
    projectId: task.project_id,
    taskId,
    comment,
  });

  return comment;
};

export const getTaskCommentsService = async ({ user, taskId }) => {
  // Verify membership via project
  const [[task]] = await pool.query(
    "SELECT project_id FROM tasks WHERE id = ?",
    [taskId]
  );

  if (!task) throw new Error("TASK_NOT_FOUND");

  const [[member]] = await pool.query(
    `SELECT 1 FROM project_members
     WHERE project_id = ? AND user_id = ?`,
    [task.project_id, user.id]
  );

  if (!member) throw new Error("FORBIDDEN");

  const [comments] = await pool.query(
    `SELECT c.id, c.content, c.created_at, u.email AS author
     FROM comments c
     JOIN users u ON u.id = c.user_id
     WHERE c.task_id = ?
     ORDER BY c.created_at ASC`,
    [taskId]
  );

  return comments;
};
