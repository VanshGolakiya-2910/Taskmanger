import { useTaskComments } from "../hooks/useTaskComments";
import type { Comment } from "../../../types/comment";

type Props = {
  projectId: number;
  taskId: number;
};

const TaskComments = ({ projectId, taskId }: Props) => {
  const { data = [] } = useTaskComments(projectId, taskId);

  return (
    <section className="border rounded p-4">
      <h3 className="font-medium mb-2">Comments</h3>

      {data.length === 0 ? (
        <div className="text-sm text-slate-500">No comments</div>
      ) : (
        data.map((c: Comment) => (
          <div key={c.id} className="text-sm border-b py-1">
            {c.content}
          </div>
        ))
      )}
    </section>
  );
};

export default TaskComments;
