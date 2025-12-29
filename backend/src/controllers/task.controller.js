import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import {
  createTaskService,
  updateTaskStatusService,
  deleteTaskService,
  getAllProjectTasksService,
  getMyAssignedTasksService,
  getTaskByIdService
} from "../services/task.service.js";
import {
  validateCreateTask,
  validateStatusUpdate,
} from "../validators/task.validator.js";

/* -------------------- CREATE TASK -------------------- */

export const createTask = asyncHandler(async (req, res) => {
  const task = await createTaskService(
    req.user,     
    req.project,  
    req.body      
  );

  res
    .status(201)
    .json(new ApiResponse(201, task));
});

/* -------------------- UPDATE TASK STATUS -------------------- */

export const updateTaskStatus = asyncHandler(async (req, res) => {
  validateStatusUpdate(req.body);

  await updateTaskStatusService(
    req.user,
    req.params.taskId,
    req.body.status
  );

  res
    .status(200)
    .json(new ApiResponse(200, null, "Status updated"));
});

/* -------------------- DELETE TASK -------------------- */

export const deleteTask = asyncHandler(async (req, res) => {
  await deleteTaskService(req.user, req.params.taskId);

  res
    .status(200)
    .json(new ApiResponse(200, null, "Task deleted"));
});

export const getAllProjectTasks = asyncHandler(async (req, res) => {
  const tasks = await getAllProjectTasksService(
    req.user,
    req.project
  );

  res.status(200).json(
    new ApiResponse(200, tasks)
  );
});

export const getMyAssignedTasks = asyncHandler(async (req, res) => {
  const tasks = await getMyAssignedTasksService(
    req.user,
    req.project
  );

  res.status(200).json(
    new ApiResponse(200, tasks)
  );
});

export const getTaskById = asyncHandler(async (req, res) => {
  const task = await getTaskByIdService(
    req.user,
    req.project,
    req.params.taskId
  );

  res.status(200).json(
    new ApiResponse(200, task)
  );
});
