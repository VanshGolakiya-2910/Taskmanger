import type { Task } from "../../../types/task";

type Props = {
  task: Task;
};

const TaskCard = ({ task }: Props) => {
  return (
    <div className="bg-white rounded border p-2 shadow-sm">
      <div className="font-medium">{task.title}</div>
      <div className="text-xs text-slate-500">
        Priority: {task.priority}
      </div>
    </div>
  );
};

export default TaskCard;
