import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

/**
 * Create socket connection
 * Called once after auth bootstrap
 */
export const connectSocket = () => {
  if (!socket) {
    socket = io(import.meta.env.VITE_SOCKET_URL, {
      withCredentials: true,
      autoConnect: false,
    });
  }

  if (!socket.connected) {
    socket.connect();
  }

  return socket;
};

/**
 * Join project-scoped room
 */
export const joinProjectRoom = (projectId: number) => {
  if (!socket) return;
  socket.emit("join", `project:${projectId}`);
};

/**
 * Leave project-scoped room
 */
export const leaveProjectRoom = (projectId: number) => {
  if (!socket) return;
  socket.emit("leave", `project:${projectId}`);
};

/**
 * Disconnect socket (logout / hard reset)
 */
export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

/**
 * Get current socket instance
 */
export const getSocket = () => socket;
