import express from "express";
import { authenticate } from "../middlewares/auth.middleware.js";
import { projectScope } from "../middlewares/projectScope.middleware.js";
import {
  createTask,
  updateTaskStatus,
  deleteTask,
} from "../controllers/task.controller.js";

const router = express.Router();

router.post(
  "/projects/:projectId/tasks",
  authenticate,
  projectScope,
  createTask
);

router.patch(
  "/tasks/:taskId/status",
  authenticate,
  updateTaskStatus
);

router.delete(
  "/tasks/:taskId",
  authenticate,
  deleteTask
);

export default router;
