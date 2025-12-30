import { SortableContext } from "@dnd-kit/sortable";
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

      <SortableContext items={tasks.map((t) => t.id)}>
        {tasks.length === 0 ? (
          <div className="text-sm text-slate-500 italic min-h-[40px]">
            No tasks
          </div>
        ) : (
          <div className="space-y-2 min-h-[40px]">
            {tasks.map((task) => (
              <TaskCard key={task.id} task={task} />
            ))}
          </div>
        )}
      </SortableContext>
    </div>
  );
};

export default KanbanColumn;
