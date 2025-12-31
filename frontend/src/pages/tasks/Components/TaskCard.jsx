import { useState } from 'react'
import Card from '../../../components/ui/Card'
import Badge from '../../../components/ui/Badge'
import Modal from '../../../components/ui/Modal'
import Button from '../../../components/ui/Button'
import StatusPicker from './StatusPicker'
import CommentsPanel from './CommentsPanel'
import { updateTaskStatusApi } from '../../../api/task.api'
import { useAuth } from '../../../hooks/useAuth'
import { canUpdateTaskStatus } from '../../../utils/permissions'

export default function TaskCard({ task, projectId, onUpdated }) {
  const { user } = useAuth()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const allowed = canUpdateTaskStatus(user, task)

  const changeStatus = async (status) => {
    setLoading(true)
    await updateTaskStatusApi(projectId, task.id, status)
    setLoading(false)
    setOpen(false)
    onUpdated()
  }

  return (
    <>
      <Card
        className="p-4 cursor-pointer"
        onClick={() => allowed && setOpen(true)}
      >
        <h3 className="font-medium text-slate-900 dark:text-white">
          {task.title}
        </h3>

        {task.description && (
          <p className="text-sm text-slate-500 mt-1">
            {task.description}
          </p>
        )}

        <div className="mt-3 flex items-center justify-between">
          <Badge>{task.status}</Badge>
          <Badge color="slate">#{task.id}</Badge>
        </div>
      </Card>

      <Modal open={open} onClose={() => setOpen(false)}>
        <h2 className="text-lg font-semibold mb-4">
          Update status
        </h2>

        <StatusPicker
          current={task.status}
          onChange={changeStatus}
        />

        <CommentsPanel
          projectId={projectId}
          taskId={task.id}
        />

        <div className="flex justify-end mt-6">
          <Button
            variant="ghost"
            onClick={() => setOpen(false)}
            disabled={loading}
          >
            Close
          </Button>
        </div>
      </Modal>
    </>
  )
}
