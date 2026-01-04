import express from "express";
import { authenticate } from "../middlewares/auth.middleware.js";
import { projectScope } from "../middlewares/projectScope.middleware.js";
import { upload } from "../config/multer.js";
import {
  uploadFile,
  deleteFile,
  getProjectFiles,
  getTaskFiles,
  downloadFile,
} from "../controllers/file.controller.js";

const router = express.Router();

router.post(
  "/projects/:projectId/upload",
  authenticate,
  projectScope,
  upload.single("file"),
  uploadFile
);

router.post(
  "/projects/:projectId/tasks/:taskId/upload",
  authenticate,
  projectScope,
  upload.single("file"),
  uploadFile
);

router.get(
  "/projects/:projectId",
  authenticate,
  projectScope,
  getProjectFiles
);

router.get(
  "/projects/:projectId/tasks/:taskId",
  authenticate,
  projectScope,
  getTaskFiles
);

router.get(
  "/:fileId/download",
  authenticate,
  downloadFile
);

router.delete(
  "/:fileId",
  authenticate,
  deleteFile
);

export default router;
