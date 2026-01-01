import express from "express";
import { authenticate } from "../middlewares/auth.middleware.js";
import { getMe, getAllUsers, createUser, updateProfile } from "../controllers/user.controller.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";

const router = express.Router();

// Get current logged-in user
router.get("/me", authenticate, getMe);

// Get all users (manager/project_manager only)
router.get(
  "/",
  authenticate,
  authorizeRoles("manager", "project_manager"),
  getAllUsers
);

// Create user (manager/project_manager only)
router.post(
  "/create",
  authenticate,
  authorizeRoles("manager", "project_manager"),
  createUser
);

// Update user's own profile
router.put("/me", authenticate, updateProfile);

export default router;
