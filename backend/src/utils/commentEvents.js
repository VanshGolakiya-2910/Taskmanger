import { emitToProject } from "../realtime/events.js";

export const emitCommentCreated = ({ projectId, taskId, comment }) => {
  emitToProject(projectId, "comment:created", {
    taskId,
    comment,
  });
};