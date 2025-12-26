import express from "express";
import { authenticate } from "../middlewares/auth.middleware.js";
import { projectScope } from "../middlewares/projectScope.middleware.js";
import { upload } from "../config/multer.js";
import {
  uploadFile,
  deleteFile,
} from "../controllers/file.controller.js";

const router = express.Router();

router.post(
  "/projects/:projectId/upload",
  authenticate,
  projectScope,
  upload.single("file"),
  uploadFile
);

router.delete(
  "/:fileId",
  authenticate,
  deleteFile
);

export default router;
