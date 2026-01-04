import { useEffect, useMemo, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { CheckCircle, Folder, ListTodo, Plus, Sparkles, ChevronDown, ArrowUpRight } from 'lucide-react'

import PageContainer from '../../components/layout/PageContainer'
import Card from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'
import Button from '../../components/ui/Button'
import { getMyProjectsApi } from '../../api/project.api'
import { getMyTasksApi } from '../../api/task.api'
import { TASK_STATUSES } from '../../utils/constant'
import { useAuth } from '../../hooks/useAuth'
import { canCreateTask } from '../../utils/permissions'
import { usePageTitle } from '../../hooks/usePageTitle'

// eslint-disable-next-line no-unused-vars
function StatCard({ title, value, icon: IconComponent, accent }) {
  return (
    <Card className="p-4 flex items-center gap-3">
      <div
        className={`w-10 h-10 rounded-lg flex items-center justify-center ${accent}`}
      >
        <IconComponent className="w-5 h-5 text-white" />
      </div>
      <div>
        <p style={{ color: 'var(--text-secondary)' }} className="text-sm">{title}</p>
        <p style={{ color: 'var(--text-primary)' }} className="text-2xl font-semibold">
          {value}
        </p>
      </div>
    </Card>
  )
}

export default function Dashboard() {
  const navigate = useNavigate()
  const { user } = useAuth()

  usePageTitle('Dashboard')

  const [projects, setProjects] = useState([])
  const [tasksByProject, setTasksByProject] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showAllTasks, setShowAllTasks] = useState(false)

  useEffect(() => {
    let mounted = true

    const loadDashboard = async () => {
      setLoading(true)
      setError(null)

      try {
        const { data } = await getMyProjectsApi()
        const projectList = data.data || []

        if (!mounted) return
        setProjects(projectList)

        const taskResults = await Promise.all(
          projectList.map(async (project) => {
            try {
              const { data: taskData } = await getMyTasksApi(project.id)
              const normalized = (taskData.data || []).map((task) => ({
                ...task,
                projectId: task.projectId || task.project_id || project.id,
              }))

              return { projectId: project.id, tasks: normalized }
            } catch {
              return { projectId: project.id, tasks: [], failed: true }
            }
          })
        )

        if (!mounted) return

        const mapped = taskResults.reduce((acc, result) => {
          acc[result.projectId] = result.tasks
          return acc
        }, {})

        setTasksByProject(mapped)

        if (taskResults.some((item) => item.failed)) {
          setError('Some projects could not load tasks. Data shown may be incomplete.')
        }
      } catch {
        if (mounted) setError('Failed to load dashboard data. Please try again.')
      } finally {
        if (mounted) setLoading(false)
      }
    }

    loadDashboard()

    return () => {
      mounted = false
    }
  }, [])

  const allTasks = useMemo(
    () => Object.values(tasksByProject).flat(),
    [tasksByProject]
  )

  const statusCounts = useMemo(() => {
    const counts = TASK_STATUSES.reduce((acc, status) => {
      acc[status.key] = 0
      return acc
    }, {})

    allTasks.forEach((task) => {
      counts[task.status] = (counts[task.status] || 0) + 1
    })

    return counts
  }, [allTasks])

  const projectNameById = useMemo(() => {
    return projects.reduce((acc, project) => {
      acc[project.id] = project.name
      return acc
    }, {})
  }, [projects])

  const tasksByDueDate = useMemo(() => {
    return allTasks
      .slice()
      .sort((a, b) => {
        const aDate = a.due_date || a.dueDate
        const bDate = b.due_date || b.dueDate

        if (!aDate && !bDate) return 0
        if (!aDate) return 1
        if (!bDate) return -1

        return new Date(aDate) - new Date(bDate)
      })
  }, [allTasks])

  const recentTasks = useMemo(() => {
    return allTasks
      .slice()
      .sort((a, b) => {
        if (a.updatedAt && b.updatedAt) {
          return new Date(b.updatedAt) - new Date(a.updatedAt)
        }
        return (b.id || 0) - (a.id || 0)
      })
      .slice(0, 5)
  }, [allTasks])

  const totalProjects = projects.length
  const totalTasks = allTasks.length
  const doneTasks = statusCounts.done || 0
  const openTasks = totalTasks - doneTasks

  if (loading) {
    return (
      <PageContainer>
        <p className="text-slate-500">Loading your dashboard…</p>
      </PageContainer>
    )
  }

  return (
    <PageContainer>
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm text-slate-500">Welcome back</p>
            <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">
              {user?.name || user?.email || 'Dashboard'}
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Stay on top of your projects and tasks in one place.
            </p>
          </div>

          <div className="flex gap-3">
            {canCreateTask(user) && (
              <Button
                className="gap-2"
                onClick={() => navigate('/tasks/new')}
              >
                <Plus className="w-4 h-4" />
                Create Task
              </Button>
            )}

            <Button onClick={() => navigate('/projects')}>
              View Projects
            </Button>

            {projects[0] && (
              <Button
                variant="secondary"
                onClick={() => navigate(`/projects/${projects[0].id}`)}
              >
                Open Latest Project
              </Button>
            )}
          </div>
        </div>

        {error && (
          <Card className="p-4 border-red-200 bg-red-50 text-red-700">
            <p className="text-sm">{error}</p>
          </Card>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatCard
            title="Projects"
            value={totalProjects}
            icon={Folder}
            accent="bg-blue-600"
          />
          <StatCard
            title="Open Tasks"
            value={openTasks}
            icon={ListTodo}
            accent="bg-amber-600"
          />
          <StatCard
            title="Completed"
            value={doneTasks}
            icon={CheckCircle}
            accent="bg-green-600"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2 p-5 md:p-4 space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                  Tasks overview
                </h2>
                <p className="text-sm text-slate-500">Your assigned work at a glance.</p>
              </div>
              <Badge color="slate">{totalTasks} tasks</Badge>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {TASK_STATUSES.map((status) => (
                <div
                  key={status.key}
                  className="flex items-center justify-between rounded-lg border border-slate-200 dark:border-slate-700 px-4 py-3"
                >
                  <div>
                    <p className="text-sm text-slate-500">{status.label}</p>
                    <p className="text-lg font-semibold text-slate-900 dark:text-white">
                      {statusCounts[status.key] || 0}
                    </p>
                  </div>
                  <Badge color={status.color}>{status.label}</Badge>
                </div>
              ))}
            </div>
            {recentTasks.length > 0 && (
              <div className="border-t border-slate-200 dark:border-slate-700 pt-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Tasks by due date</h3>
                  <p className="text-xs text-slate-500">Soonest first</p>
                </div>
                <div className={`space-y-2 ${showAllTasks ? 'max-h-96 overflow-y-auto pr-1 scroll-area' : ''}`}>
                  {(showAllTasks ? tasksByDueDate : tasksByDueDate.slice(0, 5)).map((task) => {
                    const statusMeta = TASK_STATUSES.find((s) => s.key === task.status) || {
                      label: task.status || 'Unknown',
                      color: 'slate',
                    }
                    const taskProjectId = task.projectId || task.project_id
                    const rawDue = task.due_date || task.dueDate
                    const formattedDue = rawDue
                      ? new Date(rawDue).toLocaleString(undefined, {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })
                      : 'No due date'

                    return (
                      <div
                        key={`${task.id}-${taskProjectId}`}
                        className="flex items-center justify-between gap-3 p-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                        onDoubleClick={() => navigate(`/projects/${taskProjectId}/tasks/${task.id}`)}
                      >
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-slate-900 dark:text-white truncate">
                            {task.title}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <p className="text-xs text-slate-500">Due {formattedDue}</p>
                            <span className="text-xs text-slate-400">•</span>
                            <p className="text-xs text-slate-500 truncate">
                              {projectNameById[taskProjectId] || 'Unknown'}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge color={statusMeta.color}>{statusMeta.label}</Badge>
                          <button
                            onClick={() => navigate(`/projects/${taskProjectId}/tasks/${task.id}`)}
                            aria-label={`Open task ${task.title}`}
                            className="p-2 rounded-full text-slate-500 hover:text-white hover:bg-slate-800 dark:hover:bg-white/10 transition"
                          >
                            <ArrowUpRight className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    )
                  })}
                </div>
                {tasksByDueDate.length > 5 && (
                  <div className="mt-3 flex justify-center">
                    <Button
                      variant="secondary"
                      className="gap-2"
                      onClick={() => setShowAllTasks(!showAllTasks)}
                    >
                      {showAllTasks ? (
                        <>Show Less</>
                      ) : (
                        <>
                          <ChevronDown className="w-4 h-4" />
                          Show More ({tasksByDueDate.length - 5} more)
                        </>
                      )}
                    </Button>
                  </div>
                )}
              </div>
            )}
          </Card>

          <Card className="p-5 md:p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                  Quick Links
                </h2>
                <p className="text-sm text-slate-500">Jump into work faster.</p>
              </div>
              <Sparkles className="w-5 h-5 text-amber-500" />
            </div>

            <div className="space-y-3">
              <Link
                to="/projects"
                className="flex items-center justify-between rounded-lg border border-slate-200 dark:border-slate-700 px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-800"
              >
                <div>
                  <p className="font-medium text-slate-900 dark:text-white">Projects</p>
                  <p className="text-sm text-slate-500">Browse and open your projects</p>
                </div>
                <Folder className="w-5 h-5 text-slate-500" />
              </Link>

              {projects[0] && (
                <button
                  type="button"
                  onClick={() => navigate(`/projects/${projects[0].id}`)}
                  className="w-full text-left rounded-lg border border-slate-200 dark:border-slate-700 px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer"
                  style={{ cursor: 'pointer' }}
                >
                  <p className="font-medium text-slate-900 dark:text-white">Latest project</p>
                  <p className="text-sm text-slate-500">
                    {projects[0].name}
                  </p>
                </button>
              )}

              <Link
                to={projects[0] ? `/projects/${projects[0].id}` : '/projects'}
                className="flex items-center justify-between rounded-lg border border-slate-200 dark:border-slate-700 px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-800"
              >
                <div>
                  <p className="font-medium text-slate-900 dark:text-white">Latest project</p>
                  <p className="text-sm text-slate-500">
                    {projects[0]?.name || 'Open projects'}
                  </p>
                </div>
                <Folder className="w-5 h-5 text-slate-500" />
              </Link>
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 gap-6">
          <Card className="p-5 md:p-4">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                  My Projects
                </h2>
                <p className="text-sm text-slate-500">Recent projects you belong to.</p>
              </div>
              <Badge color="blue">{totalProjects}</Badge>
            </div>

            {projects.length === 0 ? (
              <Card className="p-4 bg-slate-50 dark:bg-slate-900/60 border-dashed text-sm text-slate-600 dark:text-slate-300">
                <p className="font-medium text-slate-900 dark:text-white">No projects yet</p>
                <p className="mt-1">Create a project or ask a manager to add you.</p>
              </Card>
            ) : (
              <div className="space-y-3">
                {projects.slice(0, 4).map((project) => {
                  const taskCount = (tasksByProject[project.id] || []).length
                  return (
                    <button
                      key={project.id}
                      type="button"
                      onClick={() => navigate(`/projects/${project.id}`)}
                      className="w-full rounded-lg border border-slate-200 dark:border-slate-700 px-4 py-3 text-left hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer"
                      style={{ cursor: 'pointer' }}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-slate-900 dark:text-white">
                            {project.name}
                          </p>
                          <p className="text-xs text-slate-500">ID: {project.id}</p>
                        </div>
                        <Badge color="slate">{taskCount} tasks</Badge>
                      </div>
                    </button>
                  )
                })}
              </div>
            )}
          </Card>
        </div>
      </div>
    </PageContainer>
  )
}
