import pool from "../config/db.js";
import { ApiError } from "../utils/ApiError.js";

/* -------------------- CREATE PROJECT -------------------- */

export const createProjectService = async ({ userId, name }) => {
  if (!name || !name.trim()) {
    throw new ApiError(400, "Project name is required");
  }

  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    const [result] = await connection.query(
      "INSERT INTO projects (name, created_by) VALUES (?, ?)",
      [name.trim(), userId]
    );

    await connection.query(
      `INSERT INTO project_members (user_id, project_id, project_role)
       VALUES (?, ?, 'project_manager')`,
      [userId, result.insertId]
    );

    await connection.commit();

    return {
      id: result.insertId,
      name: name.trim(),
    };
  } catch (err) {
    await connection.rollback();
    throw err;
  } finally {
    connection.release();
  }
};

/* -------------------- ADD PROJECT MEMBER -------------------- */

export const addProjectMemberService = async ({
  projectId,
  targetUserId,
  role,
}) => {
  if (!["manager", "project_manager", "member"].includes(role)) {
    throw new ApiError(400, "Invalid project role");
  }

  // Ensure project exists
  const [[project]] = await pool.query(
    "SELECT id FROM projects WHERE id = ?",
    [projectId]
  );

  if (!project) {
    throw new ApiError(404, "Project not found");
  }

  try {
    await pool.query(
      `INSERT INTO project_members (user_id, project_id, project_role)
       VALUES (?, ?, ?)`,
      [targetUserId, projectId, role]
    );
  } catch (err) {
    if (err.code === "ER_DUP_ENTRY") {
      throw new ApiError(409, "User already in project");
    }
    throw err;
  }
};

/* -------------------- REMOVE PROJECT MEMBER -------------------- */

export const removeProjectMemberService = async ({
  projectId,
  targetUserId,
}) => {
  const [result] = await pool.query(
    `DELETE FROM project_members
     WHERE project_id = ? AND user_id = ?`,
    [projectId, targetUserId]
  );

  if (result.affectedRows === 0) {
    throw new ApiError(404, "Project member not found");
  }
};

/* -------------------- TRANSFER OWNERSHIP -------------------- */

export const transferProjectOwnershipService = async ({
  projectId,
  newManagerId,
}) => {
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    const [[project]] = await connection.query(
      "SELECT id FROM projects WHERE id = ?",
      [projectId]
    );

    if (!project) {
      throw new ApiError(404, "Project not found");
    }

    // Ensure new owner is a member
    const [[member]] = await connection.query(
      `SELECT user_id FROM project_members
       WHERE project_id = ? AND user_id = ?`,
      [projectId, newManagerId]
    );

    if (!member) {
      throw new ApiError(400, "User is not a project member");
    }

    await connection.query(
      "UPDATE projects SET created_by = ? WHERE id = ?",
      [newManagerId, projectId]
    );

    await connection.query(
      `UPDATE project_members
       SET project_role = 'project_manager'
       WHERE user_id = ? AND project_id = ?`,
      [newManagerId, projectId]
    );

    await connection.commit();
  } catch (err) {
    await connection.rollback();
    throw err;
  } finally {
    connection.release();
  }
};

/* -------------------- GET USER PROJECTS -------------------- */
export const getUserProjectsService = async (userId) => {
  const [projects] = await pool.query(
    `
    SELECT
      p.id,
      p.name,
      p.created_at,
      pm.project_role AS role_in_project
    FROM project_members pm
    JOIN projects p ON p.id = pm.project_id
    WHERE pm.user_id = ?
    ORDER BY p.created_at DESC
    `,
    [userId]
  );

  return projects;
};

export const getProjectMembersService = async (projectId) => {
  const [members] = await pool.query(
    `
    SELECT
      u.id,
      u.email,
      u.name,
      u.role AS global_role,
      pm.project_role,
      pm.joined_at
    FROM project_members pm
    JOIN users u ON u.id = pm.user_id
    WHERE pm.project_id = ?
    ORDER BY pm.joined_at ASC
    `,
    [projectId]
  );

  return members;
};

export const getProjectDetailsService = async (projectId) => {
  // 1️⃣ Project info
  const [[project]] = await pool.query(
    `
    SELECT
      id,
      name,
      created_by,
      created_at
    FROM projects
    WHERE id = ?
    `,
    [projectId]
  );

  if (!project) {
    throw new ApiError(404, "Project not found");
  }

  const [members] = await pool.query(
    `
    SELECT
      u.id,
      u.email,
      u.name,
      u.role AS global_role,
      pm.project_role,
      pm.joined_at
    FROM project_members pm
    JOIN users u ON u.id = pm.user_id
    WHERE pm.project_id = ?
    ORDER BY pm.joined_at ASC
    `,
    [projectId]
  );

  const [tasks] = await pool.query(
    `
    SELECT
      t.id,
      t.title,
      t.description,
      t.status,
      t.priority,
      t.due_date,
      t.created_at,
      u.id AS assigned_to_id,
      u.email AS assigned_to_email
    FROM tasks t
    JOIN users u ON u.id = t.assigned_to
    WHERE t.project_id = ?
    ORDER BY t.created_at DESC
    `,
    [projectId]
  );

  return {
    project,
    members,
    tasks,
  };
};
