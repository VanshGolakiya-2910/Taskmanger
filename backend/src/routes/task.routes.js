import express from "express";
import { authenticate } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";
import {
  createTask,
  updateTaskStatus,
  deleteTask,
} from "../controllers/task.controller.js";

const router = express.Router();

router.post(
  "/",
  authenticate,
  authorizeRoles("manager", "project_manager"),
  createTask
);

router.patch(
  "/:taskId/status",
  authenticate,
  updateTaskStatus
);

router.delete(
  "/:taskId",
  authenticate,
  authorizeRoles("manager", "project_manager"),
  deleteTask
);

export default router;
