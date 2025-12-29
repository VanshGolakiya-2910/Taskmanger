import pool from "../config/db.js";
import jwt from "jsonwebtoken";
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
  const refreshToken = req.cookies?.refreshToken;

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
