import pool from "../config/db.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const projectScope = asyncHandler(async (req, res, next) => {
  const projectId =
    req.params.projectId ||
    req.body.projectId ||
    req.query.projectId;

  if (!projectId) {
    throw new ApiError(400, "Project ID required");
  }

  const [[member]] = await pool.query(
    `SELECT project_role
     FROM project_members
     WHERE project_id = ? AND user_id = ?`,
    [projectId, req.user.id]
  );

  if (!member) {
    throw new ApiError(403, "Project access denied");
  }

  // Attach project context
  req.project = {
    id: projectId,
    role: member.project_role,
  };

  next();
});
