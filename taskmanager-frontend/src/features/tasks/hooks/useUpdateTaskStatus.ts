import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateTaskStatus } from "../../../api/tasks.api";
import type { Task, TaskStatus } from "../../../types/task";

export const useUpdateTaskStatus = (projectId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      taskId,
      status,
    }: {
      taskId: number;
      status: TaskStatus;
    }) =>
      updateTaskStatus(projectId, taskId, { status }),

    // OPTIMISTIC UPDATE
    onMutate: async ({ taskId, status }) => {
      await queryClient.cancelQueries({
        queryKey: ["tasks", projectId],
      });

      const previous = queryClient.getQueryData<Task[]>([
        "tasks",
        projectId,
      ]);

      queryClient.setQueryData<Task[]>(
        ["tasks", projectId],
        (old = []) =>
          old.map((task) =>
            task.id === taskId
              ? { ...task, status }
              : task
          )
      );

      return { previous };
    },

    // ROLLBACK ON ERROR
    onError: (_err, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(
          ["tasks", projectId],
          context.previous
        );
      }
    },

    // ALWAYS REVALIDATE
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["tasks", projectId],
      });
    },
  });
};
