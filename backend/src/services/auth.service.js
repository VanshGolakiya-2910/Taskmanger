import pool from "../config/db.js";
import { ApiError } from "../utils/ApiError.js";
import { hashPassword, comparePassword } from "../utils/password.js";
import { generateAccessToken, generateRefreshToken } from "../utils/token.js";

export const registerUser = async ({ email, password, role }) => {
  const [existing] = await pool.query(
    "SELECT id FROM users WHERE email = ?",
    [email]
  );

  if (existing.length > 0) {
    throw new ApiError(409, "Email already registered");
  }

  const passwordHash = await hashPassword(password);

  const [result] = await pool.query(
    "INSERT INTO users (email, password_hash, role) VALUES (?, ?, ?)",
    [email, passwordHash, role]
  );

  const payload = { id: result.insertId, role };

  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken(payload);

  await pool.query(
    `INSERT INTO refresh_tokens (user_id, token_hash, expires_at)
     VALUES (?, ?, DATE_ADD(NOW(), INTERVAL 7 DAY))`,
    [result.insertId, refreshToken]
  );

  return { accessToken, refreshToken };
};

export const loginUser = async ({ email, password }) => {
  const [users] = await pool.query(
    "SELECT id, password_hash, role FROM users WHERE email = ?",
    [email]
  );

  if (users.length === 0) {
    throw new ApiError(401, "Invalid credentials");
  }

  const user = users[0];

  const match = await comparePassword(password, user.password_hash);
  if (!match) {
    throw new ApiError(401, "Invalid credentials");
  }

  await pool.query("DELETE FROM refresh_tokens WHERE user_id = ?", [user.id]);

  const payload = { id: user.id, role: user.role };

  return {
    accessToken: generateAccessToken(payload),
    refreshToken: generateRefreshToken(payload),
  };
};
