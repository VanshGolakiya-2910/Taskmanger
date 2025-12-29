import type { Task } from "../../../types/task";
import type { KanbanColumn as Column } from "../kanban.constants";
import TaskCard from "./TaskCard";

type Props = {
  column: Column;
  tasks: Task[];
};

const KanbanColumn = ({ column, tasks }: Props) => {
  return (
    <div className="bg-slate-100 rounded p-3 flex flex-col">
      <h4 className="font-medium mb-2">{column.label}</h4>

      {tasks.length === 0 ? (
        <div className="text-sm text-slate-500 italic">
          No tasks
        </div>
      ) : (
        <div className="space-y-2">
          {tasks.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}
        </div>
      )}
    </div>
  );
};

export default KanbanColumn;
