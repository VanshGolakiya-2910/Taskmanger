import pool from "../config/db.js";
import {ApiError} from "../utils/ApiError.js";

export const getCurrentUserService = async (userId) => {
  const [[user]] = await pool.query(
    `
    SELECT
      id,
      email,
      role,
      created_at
    FROM users
    WHERE id = ?
    `,
    [userId]
  );

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  return user;
};

export const getAllUsersService = async (requestingUser) => {
  // RBAC enforcement at service level (defense-in-depth)
  if (!["manager", "project_manager"].includes(requestingUser.role)) {
    throw new ApiError(403, "Forbidden");
  }

  const [users] = await pool.query(
    `
    SELECT
      id,
      email,
      role,
      created_at
    FROM users
    ORDER BY created_at DESC
    `
  );

  return users;
};