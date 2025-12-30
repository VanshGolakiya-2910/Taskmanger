import type { Task } from "../../../types/task";

type Props = {
  task: Task;
};

const TaskMeta = ({ task }: Props) => {
  return (
    <section className="border rounded p-4">
      <h2 className="text-xl font-semibold">{task.title}</h2>
      <p className="text-sm text-slate-600 mt-1">
        Status: {task.status} • Priority: {task.priority}
      </p>
    </section>
  );
};

export default TaskMeta;
