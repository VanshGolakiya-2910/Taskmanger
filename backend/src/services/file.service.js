import pool from "../config/db.js";
import {ApiError} from "../utils/ApiError.js";
import { emitToProject } from "../realtime/events.js";
import fs from "fs/promises";


export const uploadFileService = async ({
  user,
  projectId,
  taskId = null,
  file,
}) => {
  if (!file) {
    throw new ApiError(400, "File is required");
  }

  // Only verify task belongs to project (if provided)
  if (taskId) {
    const [[task]] = await pool.query(
      `
      SELECT id
      FROM tasks
      WHERE id = ? AND project_id = ?
      `,
      [taskId, projectId]
    );

    if (!task) {
      throw new ApiError(404, "Task not found");
    }
  }

  const [result] = await pool.query(
    `
    INSERT INTO files
      (project_id, task_id, filename, filepath, uploaded_by)
    VALUES (?, ?, ?, ?, ?)
    `,
    [
      projectId,
      taskId,
      file.originalname,
      file.path,
      user.id,
    ]
  );

  emitToProject(projectId, "file:uploaded", {
    fileId: result.insertId,
    filename: file.originalname,
    taskId,
    uploadedBy: user.id,
  });

  return {
    id: result.insertId,
    filename: file.originalname,
    taskId,
  };
};


/**
 * Delete file
 * Rules:
 * - File must exist
 * - User must be project member
 * - Physical file must be deleted safely
 */
export const deleteFileService = async ({ user, fileId }) => {
  const [[file]] = await pool.query(
    `
    SELECT id, filepath, project_id
    FROM files
    WHERE id = ?
    `,
    [fileId]
  );

  if (!file) {
    throw new ApiError(404, "File not found");
  }

  // Delete DB record first
  await pool.query(
    "DELETE FROM files WHERE id = ?",
    [fileId]
  );

  // Delete physical file safely
  try {
    await fs.unlink(file.filepath);
  } catch (err) {
    // File might already be gone; do not crash
    console.warn("File deletion warning:", err.message);
  }

  emitToProject(file.project_id, "file:deleted", {
    fileId,
  });
};

/**
 * Get file for download
 */
export const getFileService = async ({ fileId }) => {
  const [[file]] = await pool.query(
    `
    SELECT id, filename, filepath, project_id
    FROM files
    WHERE id = ?
    `,
    [fileId]
  );

  if (!file) {
    throw new ApiError(404, "File not found");
  }

  return file;
};

/**
 * Get all files for a project
 */
export const getProjectFilesService = async ({ projectId }) => {
  const [files] = await pool.query(
    `
    SELECT 
      f.id,
      f.filename,
      f.filepath,
      f.uploaded_at,
      f.uploaded_by,
      f.task_id,
      u.name AS uploader_name,
      u.email AS uploader_email
    FROM files f
    LEFT JOIN users u ON u.id = f.uploaded_by
    WHERE f.project_id = ?
    ORDER BY f.uploaded_at DESC
    `,
    [projectId]
  );

  return files;
};

/**
 * Get all files for a specific task
 */
export const getTaskFilesService = async ({ projectId, taskId }) => {
  const [files] = await pool.query(
    `
    SELECT 
      f.id,
      f.filename,
      f.filepath,
      f.uploaded_at,
      f.uploaded_by,
      u.name AS uploader_name,
      u.email AS uploader_email
    FROM files f
    LEFT JOIN users u ON u.id = f.uploaded_by
    WHERE f.project_id = ? AND f.task_id = ?
    ORDER BY f.uploaded_at DESC
    `,
    [projectId, taskId]
  );

  return files;
};
