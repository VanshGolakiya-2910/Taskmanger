import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { cache } from "../config/redis.js";
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

const projectTasksKey = (projectId) => `tasks:project:${projectId}:all`;
const userTasksKey = (projectId, userId) => `tasks:project:${projectId}:user:${userId}`;
const taskByIdKey = (projectId, taskId) => `tasks:project:${projectId}:task:${taskId}`;

const invalidateProjectTaskCache = async (projectId) => {
  try {
    await cache.delByPrefix(`tasks:project:${projectId}`);
  } catch (err) {
    console.error("[cache] invalidate tasks failed", err);
  }
};

/* -------------------- CREATE TASK -------------------- */

export const createTask = asyncHandler(async (req, res) => {
  const task = await createTaskService(
    req.user,     
    req.project,  
    req.body      
  );

  await invalidateProjectTaskCache(req.project.id);

  res
    .status(201)
    .json(new ApiResponse(201, task));
});

/* -------------------- UPDATE TASK STATUS -------------------- */

export const updateTaskStatus = asyncHandler(async (req, res) => {
  validateStatusUpdate(req.body);

  const projectId = await updateTaskStatusService(
    req.user,
    req.params.taskId,
    req.body.status
  );

  if (projectId) {
    await invalidateProjectTaskCache(projectId);
  }

  res
    .status(200)
    .json(new ApiResponse(200, null, "Status updated"));
});

/* -------------------- DELETE TASK -------------------- */

export const deleteTask = asyncHandler(async (req, res) => {
  const projectId = await deleteTaskService(req.user, req.params.taskId);

  if (projectId) {
    await invalidateProjectTaskCache(projectId);
  }

  res
    .status(200)
    .json(new ApiResponse(200, null, "Task deleted"));
});

export const getAllProjectTasks = asyncHandler(async (req, res) => {
  const cacheKey = projectTasksKey(req.project.id);

  try {
    const cached = await cache.get(cacheKey);
    if (cached) {
      res.set("X-Cache", "HIT");
      return res.status(200).json(
        new ApiResponse(200, cached, "Tasks fetched (cache)")
      );
    }
  } catch (err) {
    console.error("[cache] getAllProjectTasks read failed", err);
  }

  const tasks = await getAllProjectTasksService(req.user, req.project);

  try {
    await cache.set(cacheKey, tasks, 60);
  } catch (err) {
    console.error("[cache] getAllProjectTasks write failed", err);
  }

  res.set("X-Cache", "MISS");

  res.status(200).json(
    new ApiResponse(200, tasks)
  );
});

export const getMyAssignedTasks = asyncHandler(async (req, res) => {
  const cacheKey = userTasksKey(req.project.id, req.user.id);

  try {
    const cached = await cache.get(cacheKey);
    if (cached) {
      res.set("X-Cache", "HIT");
      return res.status(200).json(
        new ApiResponse(200, cached, "Tasks fetched (cache)")
      );
    }
  } catch (err) {
    console.error("[cache] getMyAssignedTasks read failed", err);
  }

  const tasks = await getMyAssignedTasksService(req.user, req.project);

  try {
    await cache.set(cacheKey, tasks, 60);
  } catch (err) {
    console.error("[cache] getMyAssignedTasks write failed", err);
  }

  res.set("X-Cache", "MISS");

  res.status(200).json(
    new ApiResponse(200, tasks)
  );
});

export const getTaskById = asyncHandler(async (req, res) => {
  const cacheKey = taskByIdKey(req.project.id, req.params.taskId);

  try {
    const cached = await cache.get(cacheKey);
    if (cached) {
      res.set("X-Cache", "HIT");
      return res.status(200).json(
        new ApiResponse(200, cached, "Task fetched (cache)")
      );
    }
  } catch (err) {
    console.error("[cache] getTaskById read failed", err);
  }

  const task = await getTaskByIdService(
    req.user,
    req.project,
    req.params.taskId
  );

  try {
    await cache.set(cacheKey, task, 60);
  } catch (err) {
    console.error("[cache] getTaskById write failed", err);
  }

  res.set("X-Cache", "MISS");

  res.status(200).json(
    new ApiResponse(200, task)
  );
});
