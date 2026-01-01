import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { getCurrentUserService, getAllUsersService, getAvailableUsersService, createUserByManagerService, updateUserProfileService } from "../services/user.service.js";

export const getMe = asyncHandler(async (req, res) => {
  const user = await getCurrentUserService(req.user.id);

  res
    .status(200)
    .json(new ApiResponse(200, user, "User fetched"));
});

export const getAllUsers = asyncHandler(async (req, res) => {
  const users = await getAllUsersService(req.user);

  res
    .status(200)
    .json(new ApiResponse(200, users, "Users fetched"));
});

export const getAvailableUsers = asyncHandler(async (req, res) => {
  const users = await getAvailableUsersService(req.user);

  res
    .status(200)
    .json(new ApiResponse(200, users, "Available users fetched"));
});

export const createUser = asyncHandler(async (req, res) => {
  const { email, role } = req.body;

  if (!email || !role) {
    throw new ApiError(400, "Email and role are required");
  }

  const result = await createUserByManagerService(req.user, { email, role });

  res
    .status(201)
    .json(new ApiResponse(201, result, "User created by manager. Temp password sent."));
});

export const updateProfile = asyncHandler(async (req, res) => {
  const { email, name, currentPassword, newPassword } = req.body;

  const updatedUser = await updateUserProfileService(req.user.id, {
    email,
    name,
    currentPassword,
    newPassword
  });

  res
    .status(200)
    .json(new ApiResponse(200, updatedUser, "Profile updated successfully"));
});
