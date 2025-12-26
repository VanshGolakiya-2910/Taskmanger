import { Server } from "socket.io";
import jwt from "jsonwebtoken";

export const initSocketServer = (httpServer) => {
  const io = new Server(httpServer, {
    cors: {
      origin: true,
      credentials: true,
    },
  });

  // Auth middleware
  io.use((socket, next) => {
    try {
      const token =
        socket.handshake.auth?.token ||
        socket.handshake.headers?.authorization?.split(" ")[1];

      if (!token) {
        return next(new Error("Unauthorized"));
      }

      const decoded = jwt.verify(
        token,
        process.env.JWT_ACCESS_SECRET
      );

      socket.user = {
        id: decoded.id,
        role: decoded.role,
      };

      next();
    } catch (err) {
      next(new Error("Unauthorized"));
    }
  });

  io.on("connection", (socket) => {
    // Join project room
    socket.on("project:join", (projectId) => {
      socket.join(`project:${projectId}`);
    });

    socket.on("project:leave", (projectId) => {
      socket.leave(`project:${projectId}`);
    });
  });

  return io;
};
