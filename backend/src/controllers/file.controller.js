import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import {
  uploadFileService,
  deleteFileService,
} from "../services/file.service.js";

export const uploadFile = asyncHandler(async (req, res) => {
  const file = await uploadFileService({
    user: req.user,
    projectId: req.body.projectId,
    taskId: req.body.taskId,
    file: req.file,
  });

  res
    .status(201)
    .json(new ApiResponse(201, file, "File uploaded"));
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
