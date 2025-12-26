import pool from "../config/db.js";

export const createProjectService = async ({ userId, name }) => {
  const [result] = await pool.query(
    "INSERT INTO projects (name, created_by) VALUES (?, ?)",
    [name, userId]
  );

  // Creator automatically becomes project manager
  await pool.query(
    `INSERT INTO project_members (user_id, project_id, project_role)
     VALUES (?, ?, 'project_manager')`,
    [userId, result.insertId]
  );

  return {
    id: result.insertId,
    name,
  };
};

export const addProjectMemberService = async ({
  projectId,
  targetUserId,
  role,
}) => {
  if (!["manager", "project_manager", "member"].includes(role)) {
    throw new Error("INVALID_PROJECT_ROLE");
  }

  await pool.query(
    `INSERT INTO project_members (user_id, project_id, project_role)
     VALUES (?, ?, ?)`,
    [targetUserId, projectId, role]
  );
};

export const removeProjectMemberService = async ({
  projectId,
  targetUserId,
}) => {
  await pool.query(
    `DELETE FROM project_members
     WHERE project_id = ? AND user_id = ?`,
    [projectId, targetUserId]
  );
};

export const transferProjectOwnershipService = async ({
  projectId,
  newManagerId,
}) => {
  // Update project creator
  await pool.query(
    `UPDATE projects SET created_by = ? WHERE id = ?`,
    [newManagerId, projectId]
  );

  // Promote new owner inside project
  await pool.query(
    `UPDATE project_members
     SET project_role = 'project_manager'
     WHERE user_id = ? AND project_id = ?`,
    [newManagerId, projectId]
  );
};
