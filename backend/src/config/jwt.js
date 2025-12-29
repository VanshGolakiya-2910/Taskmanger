import jwt from "jsonwebtoken";
import {
  ACCESS_TOKEN_TTL,
  REFRESH_TOKEN_TTL
} from "../config/constants.js";

export const generateAccessToken = (payload) =>
  jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {
    expiresIn: ACCESS_TOKEN_TTL
  });

export const generateRefreshToken = (payload) =>
  jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
    expiresIn: REFRESH_TOKEN_TTL
  });
