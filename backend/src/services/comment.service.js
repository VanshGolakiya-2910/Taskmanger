import pool from "../config/db.js";
import { ApiError } from "../utils/ApiError.js";
import { emitCommentCreated } from "../utils/commentEvents.js";

/* -------------------- CREATE COMMENT -------------------- */

export const createCommentService = async ({ user, taskId, content }) => {
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    // Verify task exists
    const [[task]] = await connection.query(
      "SELECT project_id FROM tasks WHERE id = ?",
      [taskId]
    );

    if (!task) {
      throw new ApiError(404, "Task not found");
    }

    const [result] = await connection.query(
      `INSERT INTO comments (task_id, user_id, content)
       VALUES (?, ?, ?)`,
      [taskId, user.id, content]
    );

    const comment = {
      id: result.insertId,
      taskId,
      userId: user.id,
      content,
      projectId: task.project_id,
    };

    await connection.commit();

    emitCommentCreated({
      projectId: task.project_id,
      taskId,
      comment,
    });

    return comment;
  } catch (err) {
    await connection.rollback();
    throw err;
  } finally {
    connection.release();
  }
};

/* -------------------- GET TASK COMMENTS -------------------- */

export const getTaskCommentsService = async ({ user, taskId }) => {
  // Verify task exists
  const [[task]] = await pool.query(
    "SELECT project_id FROM tasks WHERE id = ?",
    [taskId]
  );

  if (!task) {
    throw new ApiError(404, "Task not found");
  }
  
  const [comments] = await pool.query(
    `SELECT
       c.id,
       c.content,
       c.created_at,
       u.email AS author
     FROM comments c
     JOIN users u ON u.id = c.user_id
     WHERE c.task_id = ?
     ORDER BY c.created_at ASC`,
    [taskId]
  );

  return comments;
};
