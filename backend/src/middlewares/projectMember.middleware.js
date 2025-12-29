import pool from "../config/db.js";
import {ApiError} from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

/**
 * Ensures user is a member of the project
 * Attaches project context to req.project
 */
export const requireProjectMember = asyncHandler(async (req, res, next) => {
  const { projectId } = req.params;
  const userId = req.user.id;

  if (!projectId) {
    throw new ApiError(400, "Project ID is required");
  }

  const [[member]] = await pool.query(
    `
    SELECT
      pm.project_role,
      p.id AS project_id,
      p.name
    FROM project_members pm
    JOIN projects p ON p.id = pm.project_id
    WHERE pm.project_id = ? AND pm.user_id = ?
    `,
    [projectId, userId]
  );

  if (!member) {
    throw new ApiError(403, "Forbidden");
  }

  // Trusted project context
  req.project = {
    id: member.project_id,
    role: member.project_role,
    name: member.name,
  };

  next();
});
