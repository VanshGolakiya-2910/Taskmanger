import { useEffect } from "react";
import { connectSocket, joinProjectRoom, leaveProjectRoom } from "./socket";
import { useAuth } from "../auth/useAuth";

export const useProjectSocket = (projectId: number) => {
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) return;

    connectSocket();
    joinProjectRoom(projectId);

    return () => {
      leaveProjectRoom(projectId);
    };
  }, [isAuthenticated, projectId]);
};
