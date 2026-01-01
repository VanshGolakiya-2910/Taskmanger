import pool from "../config/db.js";
import {ApiError} from "../utils/ApiError.js";
import { hashPassword, comparePassword } from "../utils/password.js";

export const getCurrentUserService = async (userId) => {
  const [[user]] = await pool.query(
    `
    SELECT
      id,
      email,
      name,
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
      name,
      role,
      created_at
    FROM users
    ORDER BY created_at DESC
    `
  );

  return users;
};

/* ======================
   CREATE USER (MANAGER ONLY)
   ====================== */

export const createUserByManagerService = async (managerUser, { email, role }) => {
  // Verify requesting user is a manager
  if (!["manager", "project_manager"].includes(managerUser.role)) {
    throw new ApiError(403, "Only managers can create users");
  }

  // Check if email already exists
  const [existing] = await pool.query(
    "SELECT id FROM users WHERE email = ?",
    [email]
  );

  if (existing.length > 0) {
    throw new ApiError(409, "Email already registered");
  }

  // Generate a temporary password
  const tempPassword = Math.random().toString(36).slice(-8);
  const passwordHash = await hashPassword(tempPassword);

  // Insert user with temporary password
  const [result] = await pool.query(
    "INSERT INTO users (email, password_hash, role) VALUES (?, ?, ?)",
    [email, passwordHash, role]
  );

  return {
    id: result.insertId,
    email,
    role,
    tempPassword, // Return temp password to manager (should be shared securely)
  };
};

/* ======================
   UPDATE USER PROFILE
   ====================== */

export const updateUserProfileService = async (userId, { email, name, currentPassword, newPassword }) => {
  const [[user]] = await pool.query(
    "SELECT id, password_hash FROM users WHERE id = ?",
    [userId]
  );

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  // If updating email, check if new email is available
  if (email) {
    const [existing] = await pool.query(
      "SELECT id FROM users WHERE email = ? AND id != ?",
      [email, userId]
    );

    if (existing.length > 0) {
      throw new ApiError(409, "Email already in use");
    }
  }

  // If updating password, verify current password
  if (newPassword) {
    if (!currentPassword) {
      throw new ApiError(400, "Current password is required to set new password");
    }

    const match = await comparePassword(currentPassword, user.password_hash);
    if (!match) {
      throw new ApiError(401, "Current password is incorrect");
    }

    const newPasswordHash = await hashPassword(newPassword);
    await pool.query(
      "UPDATE users SET password_hash = ? WHERE id = ?",
      [newPasswordHash, userId]
    );
  }

  // Update email if provided
  if (email) {
    await pool.query(
      "UPDATE users SET email = ? WHERE id = ?",
      [email, userId]
    );
  }

  // Update name if provided
  if (name !== undefined) {
    await pool.query(
      "UPDATE users SET name = ? WHERE id = ?",
      [name || null, userId]
    );
  }

  const [[updatedUser]] = await pool.query(
    "SELECT id, email, name, role, created_at FROM users WHERE id = ?",
    [userId]
  );

  return updatedUser;
};
