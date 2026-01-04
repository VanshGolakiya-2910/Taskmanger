import pool from "../config/db.js";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { ApiError } from "../utils/ApiError.js";
import { hashPassword, comparePassword } from "../utils/password.js";
import {
  generateAccessToken,
  generateRefreshToken
} from "../utils/token.js";

import {
  REFRESH_TOKEN_TTL,
  ACCESS_TOKEN_COOKIE_MAX_AGE,
  COOKIE_OPTIONS
} from "../config/constants.js";

import { secondsFromNow } from "../utils/time.js";

/* ======================
   REGISTER
   ====================== */

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
    `
    INSERT INTO refresh_tokens (user_id, token_hash, expires_at)
    VALUES (?, ?, ?)
    `,
    [result.insertId, refreshToken, secondsFromNow(REFRESH_TOKEN_TTL)]
  );

  return { accessToken, refreshToken };
};

/* ======================
   LOGIN
   ====================== */

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

  // Clear existing sessions
  await pool.query(
    "DELETE FROM refresh_tokens WHERE user_id = ?",
    [user.id]
  );

  const payload = { id: user.id, role: user.role };

  const refreshToken = generateRefreshToken(payload);

  await pool.query(
    `
    INSERT INTO refresh_tokens (user_id, token_hash, expires_at)
    VALUES (?, ?, ?)
    `,
    [user.id, refreshToken, secondsFromNow(REFRESH_TOKEN_TTL)]
  );

  return {
    accessToken: generateAccessToken(payload),
    refreshToken
  };
};

/* ======================
   REFRESH ACCESS TOKEN
   ====================== */

export const refreshAccessToken = async (req) => {
  // Accept refresh token from cookie (primary) with fallbacks for tools like Postman
  const refreshToken =
    req.cookies?.refreshToken ||
    req.body?.refreshToken ||
    req.headers["x-refresh-token"] ||
    req.headers["authorization"]?.replace(/Bearer\s+/i, "");

  if (!refreshToken) {
    throw new ApiError(401, "REFRESH_TOKEN_MISSING");
  }

  let payload;
  try {
    payload = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET
    );
  } catch {
    throw new ApiError(401, "INVALID_REFRESH_TOKEN");
  }

  const [rows] = await pool.query(
    `
    SELECT id, user_id, expires_at
    FROM refresh_tokens
    WHERE token_hash = ?
    `,
    [refreshToken]
  );

  if (rows.length === 0) {
    throw new ApiError(401, "REFRESH_TOKEN_NOT_FOUND");
  }

  if (new Date(rows[0].expires_at) < new Date()) {
    throw new ApiError(401, "REFRESH_TOKEN_EXPIRED");
  }

  const accessToken = generateAccessToken({
    id: payload.id,
    role: payload.role
  });

  return {
    accessToken,
    user: {
      id: payload.id,
      role: payload.role
    },
    cookieOptions: {
      ...COOKIE_OPTIONS,
      maxAge: ACCESS_TOKEN_COOKIE_MAX_AGE
    }
  };
};

/* ======================
   LOGOUT
   ====================== */

export const logoutUser = async (req) => {
  const refreshToken = req.cookies?.refreshToken;

  if (refreshToken) {
    await pool.query(
      `DELETE FROM refresh_tokens WHERE token_hash = ?`,
      [refreshToken]
    );
  }

  return true;
};

/* ======================
   FORGOT PASSWORD
   ====================== */

export const forgotPasswordService = async ({ email }) => {
  // Check if user exists
  const [[user]] = await pool.query(
    "SELECT id, email, name FROM users WHERE email = ?",
    [email]
  );

  if (!user) {
    // Don't reveal if email exists or not (security best practice)
    return { success: true, message: "If the email exists, a reset token has been generated" };
  }

  // Generate a secure random token
  const resetToken = crypto.randomBytes(32).toString('hex');
  const tokenHash = crypto.createHash('sha256').update(resetToken).digest('hex');

  // Token expires in 1 hour
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000);

  // Delete any existing unused tokens for this user
  await pool.query(
    "DELETE FROM password_reset_tokens WHERE user_id = ? AND used = FALSE",
    [user.id]
  );

  // Store the hashed token
  await pool.query(
    `INSERT INTO password_reset_tokens (user_id, token_hash, expires_at)
     VALUES (?, ?, ?)`,
    [user.id, tokenHash, expiresAt]
  );

  // In production, you would send this via email
  // For now, we return it (ONLY FOR DEVELOPMENT)
  return {
    success: true,
    resetToken, // REMOVE THIS IN PRODUCTION
    email: user.email,
    message: "Password reset token generated"
  };
};

/* ======================
   RESET PASSWORD
   ====================== */

export const resetPasswordService = async ({ token, newPassword }) => {
  // Hash the token to compare with stored hash
  const tokenHash = crypto.createHash('sha256').update(token).digest('hex');

  // Find valid token
  const [[resetToken]] = await pool.query(
    `SELECT id, user_id, expires_at, used
     FROM password_reset_tokens
     WHERE token_hash = ?`,
    [tokenHash]
  );

  if (!resetToken) {
    throw new ApiError(400, "Invalid or expired reset token");
  }

  if (resetToken.used) {
    throw new ApiError(400, "Reset token has already been used");
  }

  if (new Date(resetToken.expires_at) < new Date()) {
    throw new ApiError(400, "Reset token has expired");
  }

  // Update user password
  const passwordHash = await hashPassword(newPassword);
  await pool.query(
    "UPDATE users SET password_hash = ? WHERE id = ?",
    [passwordHash, resetToken.user_id]
  );

  // Mark token as used
  await pool.query(
    "UPDATE password_reset_tokens SET used = TRUE WHERE id = ?",
    [resetToken.id]
  );

  // Invalidate all refresh tokens (logout from all devices)
  await pool.query(
    "DELETE FROM refresh_tokens WHERE user_id = ?",
    [resetToken.user_id]
  );

  return {
    success: true,
    message: "Password has been reset successfully"
  };
};
