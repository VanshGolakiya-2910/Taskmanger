import { ApiError } from "../utils/ApiError.js";

export const errorHandler = (err, req, res, next) => {
  // Always log the real error (server-side)
  console.error("ERROR:", err);

  // Respect ApiError statusCode
  const statusCode =
    err instanceof ApiError
      ? err.statusCode
      : 500;

  const response = {
    success: false,
    statusCode,
    message: err.message || "Internal server error",
    errors: err.errors || []
  };

  // Expose stack ONLY in development
  if (process.env.NODE_ENV !== "production") {
    response.stack = err.stack;
  }

  res.status(statusCode).json(response);
};
