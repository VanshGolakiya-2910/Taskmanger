type Props = {
  projectId: number;
};

const ProjectHeader = ({ projectId }: Props) => {
  return (
    <header className="border-b p-4">
      <h2 className="text-lg font-semibold">
        Project #{projectId}
      </h2>
    </header>
  );
};

export default ProjectHeader;
