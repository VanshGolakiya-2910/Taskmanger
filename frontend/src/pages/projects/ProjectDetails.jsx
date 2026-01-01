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
import FileUpload from './components/FileUpload'

// eslint-disable-next-line no-unused-vars
function StatPill({ icon: IconComponent, label, value }) {
  return (
    <Card className="p-4 flex items-center gap-3">
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
    <Card className="p-4 flex items-center justify-between">
      <div>
        <p className="font-medium text-slate-900 dark:text-white">{displayName}</p>
        <p className="text-xs text-slate-500">
          Workspace: {member.global_role} · Project: {member.project_role}
        </p>
      </div>
      {canManage && (
        <Button
          variant="danger"
          className="px-3 py-1.5"
          onClick={() => onRemove(member)}
        >
          <Trash className="w-4 h-4 mr-2" />
          Remove
        </Button>
      )}
    </Card>
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
        <Card key={status.key} className="p-4 flex items-center justify-between">
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
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm text-slate-500">Project</p>
            <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">
              {project.name}
            </h1>
            <p className="text-sm text-slate-500 mt-1">ID: {project.id}</p>
          </div>

          <div className="flex gap-3 flex-wrap">
            <Button
              variant="secondary"
              className="gap-2"
              onClick={() => setChatOpen(!chatOpen)}
            >
              <MessageCircle className="w-4 h-4" />
              Chat
            </Button>

            <Button
              variant="secondary"
              className="gap-2"
              onClick={() => navigate(`/projects/${projectId}/tasks`)}
            >
              <Kanban className="w-4 h-4" />
              Task Board
            </Button>

            {canCreate && (
              <Button
                className="gap-2"
                onClick={() => navigate('/tasks/new', { state: { projectId } })}
              >
                <Plus className="w-4 h-4" />
                Create Task
              </Button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatPill icon={Folder} label="Project ID" value={`#${project.id}`} />
          <StatPill icon={Users} label="Members" value={members.length} />
          <StatPill icon={ListTodo} label="Tasks" value={tasks.length} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2 p-6">
            <SectionHeader
              title="Tasks overview"
              action={
                <Button
                  variant="secondary"
                  className="gap-2"
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
              <TaskStatusGrid tasks={tasks} />
            )}
          </Card>

          <Card className="p-6">
            <SectionHeader
              title="Members"
              action={
                canManage ? (
                  <Button className="gap-2" onClick={() => setOpenAdd(true)}>
                    <UserPlus className="w-4 h-4" />
                    Add
                  </Button>
                ) : null
              }
            />

            {members.length === 0 ? (
              <p className="text-sm text-slate-500">No members yet.</p>
            ) : (
              <div className="space-y-3">
                {members.map((member) => (
                  <MemberRow
                    key={member.id}
                    member={member}
                    canManage={canManage}
                    onRemove={setRemoveTarget}
                  />
                ))}
              </div>
            )}
          </Card>
        </div>

        <Card className="p-6">
          <SectionHeader
            title="Files"
            action={<span className="text-xs text-slate-500">Upload project files</span>}
          />
          <div className="flex items-center justify-between flex-wrap gap-3">
            <p className="text-sm text-slate-600 dark:text-slate-300">
              Upload supporting documents for this project.
            </p>
            <FileUpload projectId={projectId} onUploaded={loadDetails} />
          </div>
          <p className="text-xs text-slate-500 mt-3">
            Uploaded files will appear in the shared project space (listing not yet available).
          </p>
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
