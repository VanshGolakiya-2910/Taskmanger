import { useQuery } from "@tanstack/react-query";
import { getProjectTasks } from "../../../api/tasks.api";
import { useProject } from "../../projects/hooks/useProject";
import { KANBAN_COLUMNS } from "../kanban.constants";
import { groupTasksByStatus } from "../kanban.utils";
import KanbanColumn from "../components/KanbanColumn";

const KanbanBoard = () => {
  const { projectId } = useProject();

  const { data, isLoading, error } = useQuery({
    queryKey: ["tasks", projectId],
    queryFn: () => getProjectTasks(projectId),
  });

  if (isLoading) return <div className="p-4">Loading board…</div>;
  if (error) return <div className="p-4 text-red-500">Failed to load tasks</div>;

  const grouped = groupTasksByStatus(data ?? []);

  return (
    <div className="grid grid-cols-6 gap-4">
      {KANBAN_COLUMNS.map((col) => (
        <KanbanColumn
          key={col.id}
          column={col}
          tasks={grouped[col.id]}
        />
      ))}
    </div>
  );
};

export default KanbanBoard;
