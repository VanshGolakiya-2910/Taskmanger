import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { Task } from "../../../types/task";
import { useAuth } from "../../../auth/useAuth";
import { canMoveTask } from "../kanban.rules";

type Props = {
  task: Task;
};

const TaskCard = ({ task }: Props) => {
  const { user } = useAuth();

  const isDraggable =
    !!user &&
    canMoveTask(user.role, task.status, task.status); 

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({
    id: task.id,
    disabled: !isDraggable,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDraggable ? 1 : 0.6,
    cursor: isDraggable ? "grab" : "not-allowed",
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="bg-white rounded border p-2 shadow-sm"
    >
      <div className="font-medium">{task.title}</div>
      <div className="text-xs text-slate-500">
        Priority: {task.priority}
      </div>
    </div>
  );
};

export default TaskCard;
