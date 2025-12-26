import pool from "../config/db.js";
import { hashPassword } from "../utils/password.js";
import { generateAccessToken, generateRefreshToken } from "../utils/token.js";
import { comparePassword } from "../utils/password.js";

export const registerUser = async ({ email, password, role }) => {
  const [existing] = await pool.query(
    "SELECT id FROM users WHERE email = ?",
    [email]
  );

  if (existing.length > 0) {
    throw new Error("EMAIL_EXISTS");
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
    `INSERT INTO refresh_tokens 
     (user_id, token_hash, expires_at)
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
    throw new Error("INVALID_CREDENTIALS");
  }

  const user = users[0];

  const isMatch = await comparePassword(password, user.password_hash);
  if (!isMatch) {
    throw new Error("INVALID_CREDENTIALS");
  }

  await pool.query("DELETE FROM refresh_tokens WHERE user_id = ?", [
    user.id,
  ]);

  const payload = { id: user.id, role: user.role };

  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken(payload);

  await pool.query(
    `INSERT INTO refresh_tokens (user_id, token_hash, expires_at)
     VALUES (?, ?, DATE_ADD(NOW(), INTERVAL 7 DAY))`,
    [user.id, refreshToken]
  );

  return { accessToken, refreshToken };
};
