import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { cache } from "../config/redis.js";
import {
  createProjectService,
  addProjectMemberService,
  removeProjectMemberService,
  transferProjectOwnershipService,
  getUserProjectsService,
  getProjectMembersService,
  getProjectDetailsService,
} from "../services/project.service.js";

const userProjectsKey = (userId) => `projects:user:${userId}`;
const projectMembersKey = (projectId) => `projects:${projectId}:members`;
const projectDetailsKey = (projectId) => `projects:${projectId}:details`;

const invalidateProjectCache = async ({ projectId, userIds = [] }) => {
  const keysToDelete = [projectMembersKey(projectId), projectDetailsKey(projectId)];
  const userKeys = userIds.map(userProjectsKey);
  try {
    await Promise.all([
      ...keysToDelete.map((k) => cache.del(k)),
      ...userKeys.map((k) => cache.del(k)),
    ]);
  } catch (err) {
    console.error("[cache] project invalidate failed", err);
  }
};

/* -------------------- CREATE PROJECT -------------------- */

export const createProject = asyncHandler(async (req, res) => {
  const project = await createProjectService({
    userId: req.user.id,
    name: req.body.name,
  });

  try {
    await cache.del(userProjectsKey(req.user.id));
  } catch (err) {
    console.error("[cache] createProject invalidate failed", err);
  }

  res
    .status(201)
    .json(new ApiResponse(201, project, "Project created"));
});

/* -------------------- ADD PROJECT MEMBER -------------------- */

export const addProjectMember = asyncHandler(async (req, res) => {
  await addProjectMemberService({
    projectId: req.params.projectId,
    targetUserId: req.body.userId,
    role: req.body.role,
  });

  await invalidateProjectCache({
    projectId: req.params.projectId,
    userIds: [req.body.userId],
  });

  res
    .status(200)
    .json(new ApiResponse(200, null, "Member added"));
});

/* -------------------- REMOVE PROJECT MEMBER -------------------- */

export const removeProjectMember = asyncHandler(async (req, res) => {
  await removeProjectMemberService({
    projectId: req.params.projectId,
    targetUserId: req.params.userId,
  });

  await invalidateProjectCache({
    projectId: req.params.projectId,
    userIds: [req.params.userId],
  });

  res
    .status(200)
    .json(new ApiResponse(200, null, "Member removed"));
});

/* -------------------- TRANSFER OWNERSHIP -------------------- */

export const transferOwnership = asyncHandler(async (req, res) => {
  await transferProjectOwnershipService({
    projectId: req.params.projectId,
    newManagerId: req.body.newManagerId,
  });

  await invalidateProjectCache({
    projectId: req.params.projectId,
    userIds: [req.body.newManagerId],
  });

  res
    .status(200)
    .json(new ApiResponse(200, null, "Ownership transferred"));
});

export const getMyProjects = asyncHandler(async (req, res) => {
  const cacheKey = userProjectsKey(req.user.id);

  try {
    const cached = await cache.get(cacheKey);
    if (cached) {
      res.set("X-Cache", "HIT");
      return res
        .status(200)
        .json(new ApiResponse(200, cached, "Projects fetched (cache)"));
    }
  } catch (err) {
    console.error("[cache] getMyProjects read failed", err);
  }

  const projects = await getUserProjectsService(req.user.id);

  try {
    await cache.set(cacheKey, projects, 120);
  } catch (err) {
    console.error("[cache] getMyProjects write failed", err);
  }

  res.set("X-Cache", "MISS");

  res
    .status(200)
    .json(new ApiResponse(200, projects, "Projects fetched"));
});

export const getProjectMembers = asyncHandler(async (req, res) => {
  const cacheKey = projectMembersKey(req.project.id);

  try {
    const cached = await cache.get(cacheKey);
    if (cached) {
      res.set("X-Cache", "HIT");
      return res
        .status(200)
        .json(new ApiResponse(200, cached, "Project members fetched (cache)"));
    }
  } catch (err) {
    console.error("[cache] getProjectMembers read failed", err);
  }

  const members = await getProjectMembersService(req.project.id);

  try {
    await cache.set(cacheKey, members, 120);
  } catch (err) {
    console.error("[cache] getProjectMembers write failed", err);
  }

  res.set("X-Cache", "MISS");

  res
    .status(200)
    .json(new ApiResponse(200, members, "Project members fetched"));
});

export const getProjectDetails = asyncHandler(async (req, res) => {
  const cacheKey = projectDetailsKey(req.project.id);

  try {
    const cached = await cache.get(cacheKey);
    if (cached) {
      res.set("X-Cache", "HIT");
      return res
        .status(200)
        .json(new ApiResponse(200, cached, "Project details fetched (cache)"));
    }
  } catch (err) {
    console.error("[cache] getProjectDetails read failed", err);
  }

  const data = await getProjectDetailsService(req.project.id);

  try {
    await cache.set(cacheKey, data, 120);
  } catch (err) {
    console.error("[cache] getProjectDetails write failed", err);
  }

  res.set("X-Cache", "MISS");

  res
    .status(200)
    .json(new ApiResponse(200, data, "Project details fetched"));
});