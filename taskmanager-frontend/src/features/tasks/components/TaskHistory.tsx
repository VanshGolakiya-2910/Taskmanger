import { useTaskHistory } from "../hooks/useTaskHistory";
import type { TaskHistoryEntry } from "../../../types/task-history";

type Props = {
  taskId: number;
};

const TaskHistory = ({ taskId }: Props) => {
  const { data = [], isLoading } = useTaskHistory(taskId);

  if (isLoading) {
    return <div className="text-sm text-slate-500">Loading history…</div>;
  }

  return (
    <section className="border rounded p-4">
      <h3 className="font-medium mb-2">History</h3>

      {data.length === 0 ? (
        <div className="text-sm text-slate-500">No history</div>
      ) : (
        <ul className="space-y-1 text-sm">
          {data.map((h: TaskHistoryEntry) => (
            <li key={h.id}>
              {h.action} —{" "}
              <span className="text-slate-500">
                {new Date(h.createdAt).toLocaleString()}
              </span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};

export default TaskHistory;
