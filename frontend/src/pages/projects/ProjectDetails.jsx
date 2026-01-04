import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Folder, ListTodo, Plus, UserPlus, Users, Trash, Kanban, ArrowUpRight, MessageCircle } from 'lucide-react'

import {
  getProjectDetailsApi,
  removeProjectMemberApi,
} from '../../api/project.api'
import { TASK_STATUSES } from '../../utils/constant'
import { canManageProjectMembers, canCreateTask } from '../../utils/permissions'
import PageContainer from '../../components/layout/PageContainer'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Modal from '../../components/ui/Modal'
import Badge from '../../components/ui/Badge'
import { useAuth } from '../../hooks/useAuth'
import { useToast } from '../../hooks/useToast'
import { useChat } from '../../hooks/useChat'
import ChatPanel from '../../components/chat/ChatPanel'
import AddMemberModal from './components/AddMemberModal'
import TaskListByDueDate from './components/TaskListByDueDate'
import FileManager from '../../components/files/FileManager'
import { usePageTitle } from '../../hooks/usePageTitle'

// eslint-disable-next-line no-unused-vars
function StatPill({ icon: IconComponent, label, value }) {
  return (
    <Card className="p-4 flex items-center gap-3 hover:shadow-lg transition-all duration-200">
      <div className="w-10 h-10 rounded-lg bg-slate-900 text-white flex items-center justify-center">
        <IconComponent className="w-5 h-5" />
      </div>
      <div>
        <p className="text-xs uppercase tracking-wide text-slate-500">{label}</p>
        <p className="text-xl font-semibold text-slate-900 dark:text-white">{value}</p>
      </div>
    </Card>
  )
}

function SectionHeader({ title, action }) {
  return (
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-lg font-semibold text-slate-900 dark:text-white">{title}</h2>
      {action}
    </div>
  )
}

function MemberRow({ member, canManage, onRemove }) {
  const displayName = member.name || member.email
  return (
    <div className="group flex items-center gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 hover:scale-[1.02] transition-all duration-200 cursor-pointer">
      <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-sm font-semibold">
        {displayName.slice(0, 1).toUpperCase()}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-medium text-slate-900 dark:text-white text-sm truncate">{displayName}</p>
        <p className="text-xs text-slate-500 truncate">{member.project_role}</p>
      </div>
      {canManage && (
        <button
          onClick={() => onRemove(member)}
          className="opacity-0 group-hover:opacity-100 p-1.5 rounded hover:bg-red-50 dark:hover:bg-red-900/20 text-slate-400 hover:text-red-600 transition-all cursor-pointer"
          title="Remove member"
        >
          <Trash className="w-4 h-4" />
        </button>
      )}
    </div>
  )
}

function TaskStatusGrid({ tasks }) {
  const counts = useMemo(() => {
    const base = TASK_STATUSES.reduce((acc, s) => ({ ...acc, [s.key]: 0 }), {})
    tasks.forEach((t) => {
      base[t.status] = (base[t.status] || 0) + 1
    })
    return base
  }, [tasks])

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
      {TASK_STATUSES.map((status) => (
        <Card key={status.key} className="p-4 flex items-center justify-between hover:scale-105 hover:shadow-md hover:border-blue-500 transition-all duration-200 cursor-pointer">
          <div>
            <p className="text-xs uppercase text-slate-500">{status.label}</p>
            <p className="text-lg font-semibold text-slate-900 dark:text-white">
              {counts[status.key] || 0}
            </p>
          </div>
          <Badge color={status.color}>{status.label}</Badge>
        </Card>
      ))}
    </div>
  )
}

export default function ProjectDetails() {
  const { projectId } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const { showToast } = useToast()
  const { switchProject } = useChat()

  const [project, setProject] = useState(null)
  const [members, setMembers] = useState([])
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [chatOpen, setChatOpen] = useState(false)

  const [openAdd, setOpenAdd] = useState(false)
  const [removeTarget, setRemoveTarget] = useState(null)
  const [fileRefresh, setFileRefresh] = useState(0)

  const pageTitle = project?.name ? `${project.name} Overview` : 'Project Details'
  usePageTitle(pageTitle)

  const canManage = canManageProjectMembers(user)
  const canCreate = canCreateTask(user)

  const loadDetails = async () => {
    setLoading(true)
    setError(null)
    try {
      const { data } = await getProjectDetailsApi(projectId)
      const payload = data.data || {}
      setProject(payload.project)
      setMembers(payload.members || [])
      setTasks(payload.tasks || [])
    } catch {
      setError('Failed to load project details')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadDetails()
    // Switch to this project's chat room
    switchProject(projectId)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId])

  const removeMember = async () => {
    if (!removeTarget) return
    try {
      await removeProjectMemberApi(projectId, removeTarget.id)
      showToast('Member removed')
      setRemoveTarget(null)
      loadDetails()
    } catch {
      showToast('Could not remove member', 'error')
    }
  }

  if (loading) {
    return (
      <PageContainer>
        <p className="text-slate-500">Loading project…</p>
      </PageContainer>
    )
  }

  if (error || !project) {
    return (
      <PageContainer>
        <Card className="p-6">
          <p className="text-red-600">{error || 'Project not found'}</p>
          <div className="mt-4">
            <Button onClick={() => navigate('/projects')}>Back to projects</Button>
          </div>
        </Card>
      </PageContainer>
    )
  }

  return (
    <PageContainer>
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between animate-fade-in">
          <div className="transition-all duration-300">
            <p className="text-sm text-slate-500">Project</p>
            <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">
              {project.name}
            </h1>
            <p className="text-sm text-slate-500 mt-1">ID: {project.id}</p>
          </div>

          <div className="flex gap-3 flex-wrap">
            <Button
              variant="secondary"
              className="gap-2 hover:scale-105 transition-transform duration-200"
              onClick={() => setChatOpen(!chatOpen)}
            >
              <MessageCircle className="w-4 h-4" />
              Chat
            </Button>

            <Button
              variant="secondary"
              className="gap-2 hover:scale-105 transition-transform duration-200"
              onClick={() => navigate(`/projects/${projectId}/tasks`)}
            >
              <Kanban className="w-4 h-4" />
              Task Board
            </Button>

            {canCreate && (
              <Button
                className="gap-2 hover:scale-105 transition-transform duration-200"
                onClick={() => navigate('/tasks/new', { state: { projectId } })}
              >
                <Plus className="w-4 h-4" />
                Create Task
              </Button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="animate-fade-in" style={{ animationDelay: '100ms' }}>
            <StatPill icon={Folder} label="Project ID" value={`#${project.id}`} />
          </div>
          <button 
            onClick={() => navigate(`/projects/${projectId}/members`)}
            className="text-left hover:scale-105 transition-all duration-200 animate-fade-in"
            style={{ animationDelay: '200ms' }}
          >
            <StatPill icon={Users} label="Members" value={members.length} />
          </button>
          <button 
            onClick={() => navigate(`/projects/${projectId}/tasks`)}
            className="text-left hover:scale-105 transition-all duration-200 animate-fade-in"
            style={{ animationDelay: '300ms' }}
          >
            <StatPill icon={ListTodo} label="Tasks" value={tasks.length} />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in" style={{ animationDelay: '400ms' }}>
          <Card className="lg:col-span-2 p-6 transition-all duration-200 hover:shadow-lg">
            <SectionHeader
              title="Tasks overview"
              action={
                <Button
                  variant="secondary"
                  className="gap-2 hover:scale-105 transition-transform duration-200 cursor-pointer"
                  onClick={() => navigate(`/projects/${projectId}/tasks`)}
                >
                  <ArrowUpRight className="w-4 h-4" />
                  Open board
                </Button>
              }
            />

            {tasks.length === 0 ? (
              <p className="text-sm text-slate-500">
                No tasks yet. Create one to get started.
              </p>
            ) : (
              <div className="space-y-5">
                <TaskStatusGrid tasks={tasks} />

                <TaskListByDueDate 
                  tasks={tasks}
                  projectId={projectId}
                  navigate={navigate}
                  excludeStatuses={['backlog']}
                  itemsPerPage={5}
                />
              </div>
            )}
          </Card>

          <Card className="p-6 transition-all duration-200 hover:shadow-lg">
            <SectionHeader
              title="Members"
              action={
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => navigate(`/projects/${projectId}/members`)}
                    className="group relative p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors cursor-pointer"
                  >
                    <ArrowUpRight className="w-4 h-4" />
                    <span className="absolute hidden group-hover:block -bottom-8 right-0 px-2 py-1 text-xs bg-slate-900 dark:bg-slate-700 text-white rounded whitespace-nowrap">
                      View all
                    </span>
                  </button>
                  {canManage && (
                    <button
                      onClick={() => setOpenAdd(true)}
                      className="group relative p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors cursor-pointer"
                    >
                      <UserPlus className="w-4 h-4" />
                      <span className="absolute hidden group-hover:block -bottom-8 right-0 px-2 py-1 text-xs bg-slate-900 dark:bg-slate-700 text-white rounded whitespace-nowrap">
                        Add member
                      </span>
                    </button>
                  )}
                </div>
              }
            />

            {members.length === 0 ? (
              <p className="text-sm text-slate-500">No members yet.</p>
            ) : (
              <div className="space-y-2">
                {members.slice(0, 4).map((member) => (
                  <MemberRow
                    key={member.id}
                    member={member}
                    canManage={canManage}
                    onRemove={setRemoveTarget}
                  />
                ))}
                {members.length > 4 && (
                  <p className="text-xs text-slate-400 pt-2">
                    +{members.length - 4} more member{members.length - 4 !== 1 ? 's' : ''}
                  </p>
                )}
              </div>
            )}
          </Card>
        </div>

        <Card className="p-6">
          <SectionHeader
            title="Files"
            action={<span className="text-xs text-slate-500">Project attachments</span>}
          />
          <FileManager 
            projectId={projectId} 
            refresh={fileRefresh}
            onFileChange={() => setFileRefresh(prev => prev + 1)}
          />
        </Card>
      </div>

      <AddMemberModal
        open={openAdd}
        onClose={() => setOpenAdd(false)}
        projectId={projectId}
        onAdded={loadDetails}
      />

      <Modal open={Boolean(removeTarget)} onClose={() => setRemoveTarget(null)}>
        <h2 className="text-lg font-semibold mb-3">Remove member</h2>
        <p className="text-sm text-slate-600 mb-6">
          Remove {removeTarget?.name || removeTarget?.email} from this project?
        </p>
        <div className="flex justify-end gap-3">
          <Button variant="ghost" onClick={() => setRemoveTarget(null)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={removeMember}>
            Remove
          </Button>
        </div>
      </Modal>

      <ChatPanel isOpenProp={chatOpen} onCloseProp={setChatOpen} />
    </PageContainer>
  )
}
