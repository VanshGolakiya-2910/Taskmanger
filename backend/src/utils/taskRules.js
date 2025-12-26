export const STATUS_FLOW = {
  backlog: ["todo"],
  todo: ["in_progress"],
  in_progress: ["blocked", "in_review"],
  blocked: ["in_progress"],
  in_review: ["done", "in_progress"],
  done: [],
};

export const canTransition = (from, to) =>
  STATUS_FLOW[from]?.includes(to);

export const canManageTask = (role) =>
  role === "manager" || role === "project_manager";

export const canUpdateStatus = (role, isAssignee) =>
  isAssignee || canManageTask(role);
