import express from "express";
import { authenticate } from "../middlewares/auth.middleware.js";
import { projectScope } from "../middlewares/projectScope.middleware.js";
import {
  createTask,
  updateTaskStatus,
  deleteTask,
} from "../controllers/task.controller.js";

const router = express.Router();

/**
 * Create task under a project
 * POST /api/v1/tasks/project/:projectId
 */
router.post(
  "/project/:projectId",
  authenticate,
  projectScope,
  createTask
);

/**
 * Update task status
 * PATCH /api/v1/tasks/:taskId/status
 */
router.patch(
  "/:taskId/status",
  authenticate,
  projectScope,
  updateTaskStatus
);

/**
 * Delete task
 * DELETE /api/v1/tasks/:taskId
 */
router.delete(
  "/:taskId",
  authenticate,
  projectScope,
  deleteTask
);

export default router;
