import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import {
  uploadFileService,
  deleteFileService,
} from "../services/file.service.js";

export const uploadFile = asyncHandler(async (req, res) => {
 const result = await uploadFileService({
    user: req.user,
    projectId: req.project.id, 
    taskId: req.params.taskId || null,
    file: req.file,
  });

  res
    .status(201)
    .json(new ApiResponse(201, result, "Project created"));
});

export const deleteFile = asyncHandler(async (req, res) => {
  await deleteFileService({
    user: req.user,
    fileId: req.params.fileId,
  });

  res
    .status(200)
    .json(new ApiResponse(200, null, "File deleted"));
});
