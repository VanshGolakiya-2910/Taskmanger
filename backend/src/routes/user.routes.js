import express from "express";
import { authenticate } from "../middlewares/auth.middleware.js";
import { getMe, getAllUsers } from "../controllers/user.controller.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";

const router = express.Router();

// Get current logged-in user
router.get("/me", authenticate, getMe);
router.get(
  "/",
  authenticate,
  authorizeRoles("manager", "project_manager"),
  getAllUsers
);

export default router;
