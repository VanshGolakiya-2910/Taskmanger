import jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const authenticate = asyncHandler(async (req, res, next) => {
  let token = null;

  if (req.cookies?.accessToken) {
    token = req.cookies.accessToken;
  }

  if (!token && req.headers.authorization?.startsWith("Bearer ")) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    throw new ApiError(401, "Unauthorized");
  }

  const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);

  req.user = {
    id: decoded.id,
    role: decoded.role,
  };

  next();
});
