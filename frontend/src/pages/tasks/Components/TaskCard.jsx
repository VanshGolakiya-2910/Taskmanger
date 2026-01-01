import Card from '../../../components/ui/Card'
import Badge from '../../../components/ui/Badge'
import { useNavigate } from 'react-router-dom'

export default function TaskCard({ task, projectId }) {
  const navigate = useNavigate()

  const goToDetails = () => {
    navigate(`/projects/${projectId}/tasks/${task.id}`)
  }

  return (
    <Card
      className="p-4 cursor-pointer"
      onClick={goToDetails}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter') goToDetails()
      }}
    >
      <h3 className="font-medium text-slate-900 dark:text-white">
        {task.title}
      </h3>

      {task.description && (
        <p className="text-sm text-slate-500 mt-1 line-clamp-2">
          {task.description}
        </p>
      )}

      <div className="mt-3 flex items-center justify-between">
        <Badge>{task.status}</Badge>
        <Badge color="slate">#{task.id}</Badge>
      </div>
    </Card>
  )
}
