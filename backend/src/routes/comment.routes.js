import express from "express";
import { authenticate } from "../middlewares/auth.middleware.js";
import { projectScope } from "../middlewares/projectScope.middleware.js";
import {
  addComment,
  getTaskComments,
} from "../controllers/comment.controller.js";
import { requireProjectMember } from "../middlewares/projectMember.middleware.js";

const router = express.Router();

router.post(
  "/projects/:projectId/tasks/:taskId/comments",
  authenticate,
  projectScope,
  requireProjectMember,
  addComment
);

router.get(
  "/projects/:projectId/tasks/:taskId/comments",
  authenticate,
  projectScope,
  requireProjectMember,
  getTaskComments
);

export default router;
