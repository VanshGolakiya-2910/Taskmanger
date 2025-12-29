import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import {
  createProjectService,
  addProjectMemberService,
  removeProjectMemberService,
  transferProjectOwnershipService,
  getUserProjectsService,
} from "../services/project.service.js";

/* -------------------- CREATE PROJECT -------------------- */

export const createProject = asyncHandler(async (req, res) => {
  const project = await createProjectService({
    userId: req.user.id,
    name: req.body.name,
  });

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

  res
    .status(200)
    .json(new ApiResponse(200, null, "Ownership transferred"));
});

export const getMyProjects = asyncHandler(async (req, res) => {
  const projects = await getUserProjectsService(req.user.id);

  res
    .status(200)
    .json(new ApiResponse(200, projects, "Projects fetched"));
});