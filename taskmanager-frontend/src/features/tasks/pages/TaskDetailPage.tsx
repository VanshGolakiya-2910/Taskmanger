import { useParams } from "react-router-dom";
import { useTask } from "../hooks/useTask";
import TaskMeta from "../components/TaskMeta";
import TaskComments from "../components/TaskComments";
import TaskFiles from "../components/TaskFiles";
import TaskHistory from "../components/TaskHistory";

const TaskDetailPage = () => {
  const { projectId, taskId } = useParams();
  const { data, isLoading, isError } = useTask(
    projectId ? Number(projectId) : 0,
    taskId ? Number(taskId) : 0
  );

  if (!projectId || !taskId) {
    return <div>Invalid task URL</div>;
  }

  if (isLoading) return <div>Loading task…</div>;
  if (isError || !data) return <div>Task not found</div>;

  return (
    <div className="space-y-6">
      <TaskMeta task={data} />
      <TaskComments taskId={data.id} projectId={data.projectId} />
      <TaskFiles projectId={data.projectId} />
      <TaskHistory taskId={data.id} />
    </div>
  );
};

export default TaskDetailPage;
