import express from "express";
import { authenticate } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";
import { projectScope } from "../middlewares/projectScope.middleware.js";
import {
  createProject,
  addProjectMember,
  removeProjectMember,
  transferOwnership,
} from "../controllers/project.controller.js";

const router = express.Router();

// Create project (no projectScope yet)
router.post(
  "/",
  authenticate,
  authorizeRoles("manager", "project_manager"),
  createProject
);


// Project member management
router.post(
  "/:projectId/members",
  authenticate,
  projectScope,
  addProjectMember
);

router.delete(
  "/:projectId/members/:userId",
  authenticate,
  projectScope,
  removeProjectMember
);

router.post(
  "/:projectId/transfer",
  authenticate,
  projectScope,
  transferOwnership
);

export default router;
