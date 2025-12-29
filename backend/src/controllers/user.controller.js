import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { getCurrentUserService,  getAllUsersService } from "../services/user.service.js";

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