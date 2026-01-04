import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import {
  uploadFileService,
  deleteFileService,
  getProjectFilesService,
  getTaskFilesService,
  getFileService,
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
    .json(new ApiResponse(201, result, "File uploaded"));
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

export const getProjectFiles = asyncHandler(async (req, res) => {
  const files = await getProjectFilesService({
    projectId: req.project.id,
  });

  res
    .status(200)
    .json(new ApiResponse(200, files, "Files retrieved"));
});

export const getTaskFiles = asyncHandler(async (req, res) => {
  const files = await getTaskFilesService({
    projectId: req.project.id,
    taskId: req.params.taskId,
  });

  res
    .status(200)
    .json(new ApiResponse(200, files, "Task files retrieved"));
});

export const downloadFile = asyncHandler(async (req, res) => {
  const file = await getFileService({
    fileId: req.params.fileId,
  });

  res.download(file.filepath, file.filename);
});
