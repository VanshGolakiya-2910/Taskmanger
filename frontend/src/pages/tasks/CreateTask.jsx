import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import PageContainer from '../../components/layout/PageContainer'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import { useAuth } from '../../hooks/useAuth'
import { useToast } from '../../hooks/useToast'
import { getMyProjectsApi, getProjectMembersApi } from '../../api/project.api'
import { createTaskApi } from '../../api/task.api'
import { TASK_STATUSES } from '../../utils/constant'
import { canCreateTask } from '../../utils/permissions'

function FormField({ label, hint, children }) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-slate-700 dark:text-slate-200">
          {label}
        </label>
        {hint && <span className="text-xs text-slate-500">{hint}</span>}
      </div>
      {children}
    </div>
  )
}

const inputBase =
  'w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm text-slate-900 dark:text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-900/60'

function TextInput(props) {
  return <input className={inputBase} {...props} />
}

function TextArea(props) {
  return <textarea className={`${inputBase} min-h-[120px] resize-vertical`} {...props} />
}

function SelectInput({ children, ...props }) {
  return (
    <select className={`${inputBase} h-11`} {...props}>
      {children}
    </select>
  )
}

export default function CreateTask() {
  const navigate = useNavigate()
  const location = useLocation()
  const { user } = useAuth()
  const { showToast } = useToast()

  const [projects, setProjects] = useState([])
  const [members, setMembers] = useState([])
  const [loadingProjects, setLoadingProjects] = useState(true)
  const [loadingMembers, setLoadingMembers] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const defaultStatus = useMemo(
    () => TASK_STATUSES.find((status) => status.key === 'todo')?.key || TASK_STATUSES[0].key,
    []
  )

  const initialProjectId = location.state?.projectId || ''

  const [form, setForm] = useState({
    projectId: initialProjectId,
    title: '',
    description: '',
    dueDate: '',
    status: defaultStatus,
    assignedTo: '',
  })

  const allowed = canCreateTask(user)

  useEffect(() => {
    if (!allowed) {
      setLoadingProjects(false)
      return
    }

    let mounted = true
    const loadProjects = async () => {
      setLoadingProjects(true)
      try {
        const { data } = await getMyProjectsApi()
        const projectList = data.data || []
        if (!mounted) return
        setProjects(projectList)
        if (!form.projectId && projectList[0]) {
          setForm((prev) => ({ ...prev, projectId: projectList[0].id }))
        }
      } catch (error) {
        if (mounted) {
          showToast('Failed to load projects', 'error')
        }
      } finally {
        if (mounted) setLoadingProjects(false)
      }
    }

    loadProjects()

    return () => {
      mounted = false
    }
  }, [allowed, showToast])

  useEffect(() => {
    if (!form.projectId || !allowed) {
      setMembers([])
      setForm((prev) => ({ ...prev, assignedTo: '' }))
      return
    }

    let mounted = true
    const loadMembers = async () => {
      setLoadingMembers(true)
      try {
        const { data } = await getProjectMembersApi(form.projectId)
        if (!mounted) return
        const list = data.data || []
        setMembers(list)
        if (list.length > 0) {
          setForm((prev) => ({ ...prev, assignedTo: list[0].id }))
        }
      } catch (error) {
        if (mounted) {
          showToast('Failed to load members for this project', 'error')
          setMembers([])
          setForm((prev) => ({ ...prev, assignedTo: '' }))
        }
      } finally {
        if (mounted) setLoadingMembers(false)
      }
    }

    loadMembers()

    return () => {
      mounted = false
    }
  }, [allowed, form.projectId, showToast])

  const handleChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!allowed) {
      showToast('You do not have permission to create tasks.', 'error')
      return
    }

    if (!form.projectId || !form.title.trim() || !form.assignedTo) {
      showToast('Project, assignee, and title are required.', 'error')
      return
    }

    setSubmitting(true)
    try {
      const assigneeId = Number(form.assignedTo) || form.assignedTo
      await createTaskApi(form.projectId, {
        title: form.title.trim(),
        description: form.description.trim(),
        status: form.status,
        assignedTo: assigneeId,
        dueDate: form.dueDate || undefined,
      })

      showToast('Task created successfully')
      navigate(`/projects/${form.projectId}`)
    } catch (error) {
      showToast('Could not create task. Please try again.', 'error')
    } finally {
      setSubmitting(false)
    }
  }

  if (!allowed) {
    return (
      <PageContainer>
        <Card className="p-6">
          <h1 className="text-xl font-semibold text-slate-900 dark:text-white">Create Task</h1>
          <p className="text-sm text-slate-500 mt-2">
            You need manager permissions to create tasks.
          </p>
          <div className="mt-4">
            <Button onClick={() => navigate('/dashboard')}>Return to dashboard</Button>
          </div>
        </Card>
      </PageContainer>
    )
  }

  return (
    <PageContainer>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <p className="text-sm text-slate-500">Create</p>
          <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">
            New Task
          </h1>
          <p className="text-sm text-slate-500">
            Fill in the details below to add a task to one of your projects.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <Card className="lg:col-span-2 p-6">
            <form className="space-y-5" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField label="Project" hint="Only projects you belong to">
                  <SelectInput
                    value={form.projectId}
                    onChange={(e) => handleChange('projectId', e.target.value)}
                    disabled={loadingProjects}
                  >
                    {projects.length === 0 && (
                      <option value="">No projects available</option>
                    )}
                    {projects.map((project) => (
                      <option key={project.id} value={project.id}>
                        {project.name}
                      </option>
                    ))}
                  </SelectInput>
                </FormField>

                <FormField label="Status" hint="Start state for the task">
                  <SelectInput
                    value={form.status}
                    onChange={(e) => handleChange('status', e.target.value)}
                  >
                    {TASK_STATUSES.map((status) => (
                      <option key={status.key} value={status.key}>
                        {status.label}
                      </option>
                    ))}
                  </SelectInput>
                </FormField>
              </div>

              <FormField label="Assigned To" hint="Required and must belong to the project">
                <SelectInput
                  value={form.assignedTo}
                  onChange={(e) => handleChange('assignedTo', e.target.value)}
                  disabled={loadingMembers || members.length === 0}
                  required
                >
                  {members.length === 0 && (
                    <option value="">No members available</option>
                  )}
                  {members.map((member) => (
                    <option key={member.id} value={member.id}>
                      {member.email} ({member.role})
                    </option>
                  ))}
                </SelectInput>
              </FormField>

              <FormField label="Title" hint="Keep it short and clear">
                <TextInput
                  placeholder="e.g. Set up CI/CD pipeline"
                  value={form.title}
                  onChange={(e) => handleChange('title', e.target.value)}
                  maxLength={120}
                />
              </FormField>

              <FormField label="Description" hint="Optional details or acceptance criteria">
                <TextArea
                  placeholder="Add more context so assignees know what to do."
                  value={form.description}
                  onChange={(e) => handleChange('description', e.target.value)}
                  maxLength={1000}
                />
              </FormField>

              <FormField label="Due date" hint="Optional">
                <TextInput
                  type="date"
                  value={form.dueDate}
                  onChange={(e) => handleChange('dueDate', e.target.value)}
                />
              </FormField>

              <div className="flex items-center justify-end gap-3 pt-2">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => navigate('/dashboard')}
                  disabled={submitting}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={submitting || loadingProjects}>
                  {submitting ? 'Creating…' : 'Create Task'}
                </Button>
              </div>
            </form>
          </Card>

          <Card className="p-6 space-y-4">
            <div>
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Guidelines</h2>
              <p className="text-sm text-slate-500 mt-1">
                Keep tasks focused so owners can deliver quickly.
              </p>
            </div>

            <ul className="space-y-3 text-sm text-slate-600 dark:text-slate-300">
              <li>Use a clear, action-oriented title.</li>
              <li>Describe the expected outcome, not just steps.</li>
              <li>Pick a status that matches the current workflow stage.</li>
            </ul>

            <Card className="p-4 bg-slate-50 dark:bg-slate-900/60 border-dashed">
              <p className="text-xs text-slate-500">Need to add files or comments?</p>
              <p className="text-sm text-slate-700 dark:text-slate-200">
                Create the task first, then open it inside the project to attach files and collaborate.
              </p>
            </Card>
          </Card>
        </div>
      </div>
    </PageContainer>
  )
}
