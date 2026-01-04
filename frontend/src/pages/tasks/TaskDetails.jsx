import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Trash } from 'lucide-react'

import PageContainer from '../../components/layout/PageContainer'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Badge from '../../components/ui/Badge'
import { useAuth } from '../../hooks/useAuth'
import { useToast } from '../../hooks/useToast'
import {
  getTaskByIdApi,
  updateTaskStatusApi,
  deleteTaskApi,
} from '../../api/task.api'
import { TASK_STATUSES } from '../../utils/constant'
import {
  canUpdateTaskStatus,
  canDeleteTask,
} from '../../utils/permissions'
import StatusPicker from './Components/StatusPicker'
import CommentsPanel from './Components/CommentsPanel'
import FileManager from '../../components/files/FileManager'

function InfoRow({ label, value }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-slate-500">{label}</span>
      <span className="text-slate-900 dark:text-white">{value || '—'}</span>
    </div>
  )
}

export default function TaskDetails() {
  const { projectId, taskId } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const { showToast } = useToast()

  const [task, setTask] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [statusSaving, setStatusSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)

  const prettyDueDate = useMemo(() => {
    const raw = task?.due_date || task?.dueDate
    if (!raw) return 'Not set'

    const date = new Date(raw)
    if (Number.isNaN(date.getTime())) return 'Not set'

    // Format as DD/MM/YYYY HH:MM
    const day = String(date.getDate()).padStart(2, '0')
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const year = date.getFullYear()
    const hours = String(date.getHours()).padStart(2, '0')
    const minutes = String(date.getMinutes()).padStart(2, '0')

    return `${day}/${month}/${year} ${hours}:${minutes}`
  }, [task])

  const statusMeta = useMemo(() => {
    const found = TASK_STATUSES.find((s) => s.key === task?.status)
    return found || { label: task?.status || 'Unknown', color: 'slate' }
  }, [task])

  const allowedUpdate = canUpdateTaskStatus(user, task)
  const allowedDelete = canDeleteTask(user)

  const loadTask = async () => {
    setLoading(true)
    setError(null)
    try {
      const { data } = await getTaskByIdApi(projectId, taskId)
      setTask(data.data)
    } catch {
      setError('Failed to load task')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadTask()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId, taskId])

  const updateStatus = async (status) => {
    if (!allowedUpdate) return
    setStatusSaving(true)
    try {
      await updateTaskStatusApi(projectId, taskId, status)
      await loadTask()
      showToast('Status updated')
    } catch {
      showToast('Could not update status', 'error')
    } finally {
      setStatusSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!allowedDelete) return
    setDeleting(true)
    try {
      await deleteTaskApi(projectId, taskId)
      showToast('Task deleted')
      navigate(`/projects/${projectId}/tasks`)
    } catch {
      showToast('Could not delete task', 'error')
    } finally {
      setDeleting(false)
      setConfirmDelete(false)
    }
  }

  if (loading) {
    return (
      <PageContainer>
        <p className="text-slate-500">Loading task…</p>
      </PageContainer>
    )
  }

  if (error || !task) {
    return (
      <PageContainer>
        <Card className="p-6">
          <p className="text-red-600">{error || 'Task not found'}</p>
          <div className="mt-4 flex gap-3">
            <Button onClick={() => navigate(`/projects/${projectId}/tasks`)}>
              Back to board
            </Button>
            <Button variant="secondary" onClick={() => navigate('/dashboard')}>
              Dashboard
            </Button>
          </div>
        </Card>
      </PageContainer>
    )
  }

  return (
    <PageContainer>
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-3">
            <Button
              variant="secondary"
              className="px-3"
              onClick={() => navigate(-1)}
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              Back
            </Button>
            <div>
              <p className="text-sm text-slate-500">Task</p>
              <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">
                {task.title}
              </h1>
              <p className="text-xs text-slate-500 mt-1">ID: {task.id}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <Badge color={statusMeta.color}>{statusMeta.label}</Badge>
            {allowedDelete && (
              <Button
                variant="danger"
                className="gap-2"
                onClick={() => setConfirmDelete(true)}
                disabled={deleting}
              >
                <Trash className="w-4 h-4" />
                Delete
              </Button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2 p-6 space-y-4">
            <div>
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">Description</h2>
              <p className="text-sm text-slate-700 dark:text-slate-300 whitespace-pre-line">
                {task.description || 'No description provided.'}
              </p>
            </div>

            <div className="border-t border-slate-200 dark:border-slate-700 pt-4">
              <h3 className="text-base font-semibold text-slate-900 dark:text-white mb-3">Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <InfoRow label="Project" value={`#${projectId}`} />
                <InfoRow label="Assigned To" value={task.assigned_to || task.assignedTo} />
                <InfoRow label="Due Date" value={prettyDueDate} />
                <InfoRow label="Status" value={statusMeta.label} />
              </div>
            </div>

            {allowedUpdate && (
              <div className="border-t border-slate-200 dark:border-slate-700 pt-4">
                <StatusPicker current={task.status} onChange={updateStatus} />
                {statusSaving && (
                  <p className="text-xs text-slate-500 mt-2">Saving…</p>
                )}
              </div>
            )}
          </Card>

          <Card className="p-6">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">Comments</h2>
            <CommentsPanel projectId={projectId} taskId={taskId} />
          </Card>

          <Card className="p-6">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">Files</h2>
            <FileManager 
              projectId={projectId} 
              taskId={taskId} 
              compact
            />
          </Card>
        </div>
      </div>

      {confirmDelete && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
          <Card className="p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Delete task?</h3>
            <p className="text-sm text-slate-600 mt-2">
              This action cannot be undone. The task and its history will be removed.
            </p>
            <div className="flex justify-end gap-3 mt-5">
              <Button variant="ghost" onClick={() => setConfirmDelete(false)} disabled={deleting}>
                Cancel
              </Button>
              <Button variant="danger" onClick={handleDelete} disabled={deleting}>
                {deleting ? 'Deleting…' : 'Delete'}
              </Button>
            </div>
          </Card>
        </div>
      )}
    </PageContainer>
  )
}
