import type { UserRole } from "../types/user";
import type { TaskStatus } from "../types/task";

/* ---------------- GLOBAL ROLE CHECKS ---------------- */

export const isManager = (role: UserRole) => role === "manager";

export const isProjectManager = (role: UserRole) =>
  role === "project_manager";

export const isMember = (role: UserRole) => role === "member";

/* ---------------- PROJECT LEVEL ---------------- */

export const canManageProjectMembers = (
  userRole: UserRole
): boolean =>
  userRole === "manager" || userRole === "project_manager";

export const canCreateProject = (userRole: UserRole): boolean =>
  userRole === "manager";

/* ---------------- TASK LEVEL ---------------- */

export const canCreateTask = (userRole: UserRole): boolean =>
  userRole === "manager" || userRole === "project_manager";

export const canDeleteTask = (userRole: UserRole): boolean =>
  userRole === "manager" || userRole === "project_manager";

export const canMoveTaskToDone = (userRole: UserRole): boolean =>
  userRole === "manager" || userRole === "project_manager";

/* ---------------- STATUS TRANSITIONS ---------------- */
/* Mirrors SRS v1 rules */

export const canTransitionTaskStatus = (
  userRole: UserRole,
  from: TaskStatus,
  to: TaskStatus
): boolean => {
  if (from === "done") return false;

  if (userRole === "member") {
    return (
      (from === "todo" && to === "in_progress") ||
      (from === "in_progress" &&
        (to === "blocked" || to === "in_review")) ||
      (from === "blocked" && to === "in_progress")
    );
  }

  // Manager / PM override
  return true;
};
