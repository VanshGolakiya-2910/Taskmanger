import { useTaskFiles } from "../hooks/useTaskFiles";
import type { TaskFile } from "../../../types/file";

type Props = {
  projectId: number;
};

const TaskFiles = ({ projectId }: Props) => {
  const { data = [] } = useTaskFiles(projectId);

  return (
    <section className="border rounded p-4">
      <h3 className="font-medium mb-2">Files</h3>

      {data.length === 0 ? (
        <div className="text-sm text-slate-500">No files</div>
      ) : (
        <ul className="space-y-1">
          {data.map((file: TaskFile) => (
            <li key={file.id} className="text-sm">
              {file.originalName}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};

export default TaskFiles;
