import { DndContext, closestCenter } from "@dnd-kit/core";
import type { DragEndEvent } from "@dnd-kit/core";
import { KANBAN_COLUMNS } from "../kanban.constants";
import KanbanColumn from "../components/KanbanColumn";
import type { Task, TaskStatus } from "../../../types/task";
import { canMoveTask } from "../kanban.rules";
import { useAuth } from "../../../auth/hooks/useAuth";

type Props = {
  tasksByStatus: Record<TaskStatus, Task[]>;
};

const KanbanBoardDnd = ({ tasksByStatus }: Props) => {
  const { user } = useAuth();

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || !user) return;

    const taskId = Number(active.id);
    const newStatus = over.id as TaskStatus;

    const task = Object.values(tasksByStatus)
      .flat()
      .find((t) => t.id === taskId);

    if (!task) return;

    const allowed = canMoveTask(
      user.role,
      task.status,
      newStatus
    );

    if (!allowed) return;

    // 🔜 NEXT STEP:
    // trigger mutation (optimistic update)
  };

  return (
    <DndContext
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <div className="grid grid-cols-6 gap-4">
        {KANBAN_COLUMNS.map((col) => (
          <KanbanColumn
            key={col.id}
            column={col}
            tasks={tasksByStatus[col.id]}
          />
        ))}
      </div>
    </DndContext>
  );
};

export default KanbanBoardDnd;
