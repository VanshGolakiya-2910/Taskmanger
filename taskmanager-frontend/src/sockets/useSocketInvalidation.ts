import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { getSocket } from "./socket";
import { useProject } from "../features/projects/hooks/useProject";

export const useSocketInvalidation = () => {
  const queryClient = useQueryClient();
  const { projectId } = useProject();

  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;

    const invalidateTasks = () => {
      queryClient.invalidateQueries({
        queryKey: ["tasks", projectId],
      });
    };

    const invalidateFiles = () => {
      queryClient.invalidateQueries({
        queryKey: ["files", projectId],
      });
    };

    const invalidateComments = (payload: {
      taskId: number;
    }) => {
      queryClient.invalidateQueries({
        queryKey: ["comments", projectId, payload.taskId],
      });
    };

    socket.on("task:status_updated", invalidateTasks);
    socket.on("file:uploaded", invalidateFiles);
    socket.on("file:deleted", invalidateFiles);
    socket.on("comment:created", invalidateComments);

    return () => {
      socket.off("task:status_updated", invalidateTasks);
      socket.off("file:uploaded", invalidateFiles);
      socket.off("file:deleted", invalidateFiles);
      socket.off("comment:created", invalidateComments);
    };
  }, [projectId, queryClient]);
};
