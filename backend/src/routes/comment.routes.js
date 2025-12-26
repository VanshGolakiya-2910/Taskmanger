import express from "express";
import { authenticate } from "../middlewares/auth.middleware.js";
import {
  addComment,
  getTaskComments,
} from "../controllers/comment.controller.js";

const router = express.Router();

// /api/v1/comments/task/:taskId
router.post(
  "/task/:taskId",
  authenticate,
  addComment
);

router.get(
  "/task/:taskId",
  authenticate,
  getTaskComments
);

export default router;
