import express from "express";
import { authenticate } from "../middlewares/auth.middleware.js";
import { projectScope } from "../middlewares/projectScope.middleware.js";
import {
  createTask,
  updateTaskStatus,
  deleteTask,
  getAllProjectTasks,
  getMyAssignedTasks,
  getTaskById 
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
  "/project/:projectId/:taskId/status",
  authenticate,
  projectScope,
  updateTaskStatus
);
  
/**
 * Delete task
 * DELETE /api/v1/tasks/:taskId
 */
router.delete(
  "/project/:projectId/:taskId",
  authenticate,
  projectScope,
  deleteTask
);

router.get(
  "/project/:projectId",
  authenticate,
  projectScope,
  getAllProjectTasks
);

router.get(
  "/project/:projectId/my",
  authenticate,
  projectScope,
  getMyAssignedTasks
);

// Single task by id (project scoped)
router.get(
  "/project/:projectId/:taskId",
  authenticate,
  projectScope,
  getTaskById
);


export default router;
