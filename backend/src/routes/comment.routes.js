import express from "express";
import { authenticate } from "../middlewares/auth.middleware.js";
import { projectScope } from "../middlewares/projectScope.middleware.js";
import {
  addComment,
  getTaskComments,
} from "../controllers/comment.controller.js";

const router = express.Router();

router.post(
  "/projects/:projectId/tasks/:taskId/comments",
  authenticate,
  projectScope,
  addComment
);

router.get(
  "/projects/:projectId/tasks/:taskId/comments",
  authenticate,
  projectScope,
  getTaskComments
);

export default router;
