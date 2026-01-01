/**
 * ROLE HELPERS
 */
export const isManager = (user) =>
  user?.role === "manager";

export const isProjectManager = (user) =>
  user?.role === "project_manager";

export const isPrivileged = (user) =>
  isManager(user) || isProjectManager(user);

/**
 * TASK PERMISSIONS
 */

// Can update task status
export const canUpdateTaskStatus = (user, task) => {
  if (!user || !task) return false;

  // Managers & Project Managers can update any task
  if (isPrivileged(user)) return true;

  // Members only if assigned
  return task.assignedTo === user.id;
};

// Can delete task
export const canDeleteTask = (user) => {
  if (!user) return false;
  return isPrivileged(user);
};

// Can assign or reassign task
export const canAssignTask = (user) => {
  if (!user) return false;
  return isPrivileged(user);
};

// Can create task
export const canCreateTask = (user) => {
  if (!user) return false;
  return isPrivileged(user);
};

/**
 * PROJECT PERMISSIONS
 */

// Can manage project members
export const canManageProjectMembers = (user) => {
  if (!user) return false;
  return isPrivileged(user);
};

// Can transfer project ownership
export const canTransferOwnership = (user) => {
  if (!user) return false;
  return user.role === "manager";
};

/**
 * FILE PERMISSIONS
 */

// Can upload files (project or task)
export const canUploadFile = (user) => {
  if (!user) return false;
  return true; // any project member
};

// Can delete file (same rule as backend)
export const canDeleteFile = (user) => {
  if (!user) return false;
  return true; // any project member
};

/**
 * COMMENT PERMISSIONS
 */

// Can add comment
export const canAddComment = (user) => {
  if (!user) return false;
  return true; // any project member
};

/**
 * USER / ADMIN PERMISSIONS
 */

// Can view all users
export const canViewAllUsers = (user) => {
  if (!user) return false;
  return isPrivileged(user);
};
