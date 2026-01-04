import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import PageContainer from "../../components/layout/PageContainer";
import Button from "../../components/ui/Button";
import TaskCard from "./Components/TaskCard";
import CreateTaskModal from "./Components/CreateModal";
import { TASK_STATUSES } from "../../utils/constant";
import { getProjectTasksApi } from "../../api/task.api";
import { useAuth } from "../../hooks/useAuth";
import { usePageTitle } from "../../hooks/usePageTitle";

export default function TaskBoard() {
  const { projectId } = useParams();
  const { user } = useAuth();

  usePageTitle(`Project ${projectId} Tasks`);

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openCreate, setOpenCreate] = useState(false);

  const canCreate = user.role === "manager" || user.role === "project_manager";

  const loadTasks = async () => {
    setLoading(true);
    const { data } = await getProjectTasksApi(projectId);
    setTasks(data.data);
    setLoading(false);
  };

  useEffect(() => {
    let mounted = true;

    const fetchTasks = async () => {
      setLoading(true);
      try {
        const { data } = await getProjectTasksApi(projectId);
        if (mounted) {
          setTasks(data.data);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchTasks();

    return () => {
      mounted = false;
    };
  }, [projectId]);

  if (loading) {
    return (
      <PageContainer>
        <p className="text-slate-500">Loading tasks…</p>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">
          Tasks
        </h1>

        {canCreate && (
          <Button onClick={() => setOpenCreate(true)}>New Task</Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {TASK_STATUSES.map((status) => (
          <div key={status.key}>
            <h3 className="text-sm font-medium text-slate-600 mb-3">
              {status.label}
            </h3>

            <div className="space-y-3">
              {tasks
                .filter((t) => t.status === status.key)
                .map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    projectId={projectId}
                    onUpdated={loadTasks}
                  />
                ))}
            </div>
          </div>
        ))}
      </div>

      <CreateTaskModal
        open={openCreate}
        onClose={() => setOpenCreate(false)}
        projectId={projectId}
        onCreated={loadTasks}
      />
    </PageContainer>
  );
}
