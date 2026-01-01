import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { cache } from "../config/redis.js";
import { getCurrentUserService, getAllUsersService, getAvailableUsersService, createUserByManagerService, updateUserProfileService } from "../services/user.service.js";

const currentUserKey = (userId) => `users:${userId}:me`;
const allUsersKey = "users:all";
const availableUsersKey = "users:available";

const canManageUsers = (role) => ["manager", "project_manager"].includes(role);

const invalidateUserCaches = async (userId) => {
  try {
    await Promise.all([
      cache.del(allUsersKey),
      cache.del(availableUsersKey),
      userId ? cache.del(currentUserKey(userId)) : Promise.resolve(),
    ]);
  } catch (err) {
    console.error("[cache] user invalidate failed", err);
  }
};

export const getMe = asyncHandler(async (req, res) => {
  const cacheKey = currentUserKey(req.user.id);

  try {
    const cached = await cache.get(cacheKey);
    if (cached) {
      res.set("X-Cache", "HIT");
      return res
        .status(200)
        .json(new ApiResponse(200, cached, "User fetched (cache)"));
    }
  } catch (err) {
    console.error("[cache] getMe read failed", err);
  }

  const user = await getCurrentUserService(req.user.id);

  try {
    await cache.set(cacheKey, user, 60);
  } catch (err) {
    console.error("[cache] getMe write failed", err);
  }

  res.set("X-Cache", "MISS");

  res
    .status(200)
    .json(new ApiResponse(200, user, "User fetched"));
});

export const getAllUsers = asyncHandler(async (req, res) => {
  if (!canManageUsers(req.user.role)) {
    throw new ApiError(403, "Forbidden");
  }

  try {
    const cached = await cache.get(allUsersKey);
    if (cached) {
      res.set("X-Cache", "HIT");
      return res
        .status(200)
        .json(new ApiResponse(200, cached, "Users fetched (cache)"));
    }
  } catch (err) {
    console.error("[cache] getAllUsers read failed", err);
  }

  const users = await getAllUsersService(req.user);

  try {
    await cache.set(allUsersKey, users, 120);
  } catch (err) {
    console.error("[cache] getAllUsers write failed", err);
  }

  res.set("X-Cache", "MISS");

  res
    .status(200)
    .json(new ApiResponse(200, users, "Users fetched"));
});

export const getAvailableUsers = asyncHandler(async (req, res) => {
  if (!canManageUsers(req.user.role)) {
    throw new ApiError(403, "Forbidden");
  }

  try {
    const cached = await cache.get(availableUsersKey);
    if (cached) {
      res.set("X-Cache", "HIT");
      return res
        .status(200)
        .json(new ApiResponse(200, cached, "Available users fetched (cache)"));
    }
  } catch (err) {
    console.error("[cache] getAvailableUsers read failed", err);
  }

  const users = await getAvailableUsersService(req.user);

  try {
    await cache.set(availableUsersKey, users, 120);
  } catch (err) {
    console.error("[cache] getAvailableUsers write failed", err);
  }

  res.set("X-Cache", "MISS");

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

  await invalidateUserCaches();

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

  await invalidateUserCaches(req.user.id);

  res
    .status(200)
    .json(new ApiResponse(200, updatedUser, "Profile updated successfully"));
});
