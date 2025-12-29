import express from "express";
import { authenticate } from "../middlewares/auth.middleware.js";
import { projectScope } from "../middlewares/projectScope.middleware.js";
import { upload } from "../config/multer.js";
import {
  uploadFile,
  deleteFile,
} from "../controllers/file.controller.js";
import { requireProjectMember } from "../middlewares/projectMember.middleware.js";

const router = express.Router();

router.post(
  "/projects/:projectId/upload",
  authenticate,
  projectScope,
  requireProjectMember,
  upload.single("file"),
  uploadFile
);

router.delete(
  "/:fileId",
  authenticate,
  projectScope,
  requireProjectMember,
  deleteFile
);

export default router;
