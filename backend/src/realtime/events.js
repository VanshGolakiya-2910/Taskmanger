import { io } from "../server.js";

export const emitToProject = (projectId, event, payload) => {
  io.to(`project:${projectId}`).emit(event, payload);
};
