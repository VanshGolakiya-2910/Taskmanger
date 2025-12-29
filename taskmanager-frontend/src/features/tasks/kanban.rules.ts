import type { TaskStatus } from "../../types/task";
import type { UserRole } from "../../types/user";

/**
 * Returns whether a task status change is allowed
 * Mirrors backend SRS rules v1
 */
export const canMoveTask = (
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

  // manager / project_manager override
  return true;
};
