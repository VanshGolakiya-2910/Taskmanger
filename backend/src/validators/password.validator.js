import { ApiError } from '../utils/ApiError.js';

export const validateForgotPassword = ({ email }) => {
  if (!email) {
    throw new ApiError(400, 'Email is required');
  }

  // Basic email format validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw new ApiError(400, 'Valid email is required');
  }
};

export const validateResetPassword = ({ token, newPassword }) => {
  if (!token) {
    throw new ApiError(400, 'Reset token is required');
  }

  if (token.length !== 64) {
    throw new ApiError(400, 'Invalid token format');
  }

  if (!newPassword) {
    throw new ApiError(400, 'New password is required');
  }

  if (newPassword.length < 6) {
    throw new ApiError(400, 'Password must be at least 6 characters long');
  }
};
