import express from "express";
import { authenticate } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";
import {
  createProject,
  addProjectMember,
  removeProjectMember,
  transferOwnership,
} from "../controllers/project.controller.js";

const router = express.Router();

router.post(
  "/",
  authenticate,
  authorizeRoles("manager"),
  createProject
);

router.post(
  "/:projectId/members",
  authenticate,
  authorizeRoles("manager", "project_manager"),
  addProjectMember
);

router.delete(
  "/:projectId/members/:userId",
  authenticate,
  authorizeRoles("manager", "project_manager"),
  removeProjectMember
);

router.patch(
  "/:projectId/transfer",
  authenticate,
  authorizeRoles("manager"),
  transferOwnership
);

export default router;
