// config/constants.js

/* =======================
   TOKEN & AUTH CONSTANTS
   ======================= */

export const ACCESS_TOKEN_TTL = 15 * 60;              // seconds
export const REFRESH_TOKEN_TTL = 7 * 24 * 60 * 60;    // seconds

export const ACCESS_TOKEN_COOKIE_MAX_AGE =
  ACCESS_TOKEN_TTL * 1000;

export const REFRESH_TOKEN_COOKIE_MAX_AGE =
  REFRESH_TOKEN_TTL * 1000;


/* =======================
   COOKIE SETTINGS
   ======================= */

export const COOKIE_OPTIONS = {
  httpOnly: true,
  sameSite: "lax",
  secure: process.env.NODE_ENV === "production"
};


/* =======================
   PAGINATION (FUTURE)
   ======================= */

export const DEFAULT_PAGE = 1;
export const DEFAULT_LIMIT = 20;
export const MAX_LIMIT = 100;


/* =======================
   SOCKET / REALTIME
   ======================= */

export const SOCKET_ROOMS = {
  PROJECT: (projectId) => `project:${projectId}`
};


/* =======================
   MISC
   ======================= */

export const PASSWORD_SALT_ROUNDS = 10;
