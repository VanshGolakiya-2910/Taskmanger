import express from "express";
import { authenticate } from "../middlewares/auth.middleware.js";
import { upload } from "../config/multer.js";
import {
  uploadFile,
  deleteFile,
} from "../controllers/file.controller.js";

const router = express.Router();

router.post(
  "/upload",
  authenticate,
  upload.single("file"),
  uploadFile
);

router.delete(
  "/:fileId",
  authenticate,
  deleteFile
);

export default router;
