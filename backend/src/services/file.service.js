import pool from "../config/db.js";
import { ApiError } from "../utils/ApiError.js";
import { emitToProject } from "../realtime/events.js";
import fs from "fs";

export const uploadFileService = async ({
  user,
  projectId,
  taskId,
  file,
}) => {
  const [[member]] = await pool.query(
    `SELECT 1 FROM project_members
     WHERE project_id = ? AND user_id = ?`,
    [projectId, user.id]
  );

  if (!member) {
    throw new ApiError(403, "Forbidden");
  }

  const [result] = await pool.query(
    `INSERT INTO files
     (project_id, task_id, filename, filepath, uploaded_by)
     VALUES (?, ?, ?, ?, ?)`,
    [
      projectId,
      taskId || null,
      file.originalname,
      file.path,
      user.id,
    ]
  );

  emitToProject(projectId, "file:uploaded", {
    fileId: result.insertId,
    filename: file.originalname,
    taskId,
  });

  return {
    id: result.insertId,
    filename: file.originalname,
  };
};

export const deleteFileService = async ({ user, fileId }) => {
  const [[file]] = await pool.query(
    "SELECT * FROM files WHERE id = ?",
    [fileId]
  );

  if (!file) {
    throw new ApiError(404, "File not found");
  }

  const [[member]] = await pool.query(
    `SELECT 1 FROM project_members
     WHERE project_id = ? AND user_id = ?`,
    [file.project_id, user.id]
  );

  if (!member) {
    throw new ApiError(403, "Forbidden");
  }

  await pool.query("DELETE FROM files WHERE id = ?", [fileId]);

  fs.unlinkSync(file.filepath);
};
