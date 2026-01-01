import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, UserPlus, Users, Trash } from 'lucide-react'
import { getProjectDetailsApi, removeProjectMemberApi } from '../../api/project.api'
import { canManageProjectMembers } from '../../utils/permissions'
import PageContainer from '../../components/layout/PageContainer'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Modal from '../../components/ui/Modal'
import { useAuth } from '../../hooks/useAuth'
import { useToast } from '../../hooks/useToast'
import AddMemberModal from './components/AddMemberModal'

function MemberCard({ member, canManage, onRemove }) {
  const displayName = member.name || member.email
  const initials = (displayName || 'U')
    .split(' ')
    .map(word => word[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  return (
    <Card className="p-5 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center text-white text-base font-semibold shrink-0">
          {initials}
        </div>
        <div>
          <p className="font-semibold text-slate-900 dark:text-white">{displayName}</p>
          <p className="text-sm text-slate-500 mt-0.5">
            {member.email}
          </p>
          <div className="flex gap-2 mt-2">
            <span className="text-xs px-2 py-0.5 rounded bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
              Workspace: {member.global_role}
            </span>
            <span className="text-xs px-2 py-0.5 rounded bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
              Project: {member.project_role}
            </span>
          </div>
        </div>
      </div>
      {canManage && (
        <Button
          variant="secondary"
          className="px-3 py-2 text-slate-600 hover:text-red-600 hover:border-red-300"
          onClick={() => onRemove(member)}
        >
          <Trash className="w-4 h-4 mr-1.5" />
          Remove
        </Button>
      )}
    </Card>
  )
}

export default function ProjectMembers() {
  const { projectId } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const { showToast } = useToast()

  const [project, setProject] = useState(null)
  const [members, setMembers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [openAdd, setOpenAdd] = useState(false)
  const [removeTarget, setRemoveTarget] = useState(null)

  const canManage = user && project ? canManageProjectMembers(user, project) : false

  const loadDetails = async () => {
    setLoading(true)
    setError(null)
    try {
      const { data } = await getProjectDetailsApi(projectId)
      const payload = data.data || {}
      setProject(payload.project)
      setMembers(payload.members || [])
    } catch (err) {
      setError(err.message)
      showToast('Failed to load project members', 'error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadDetails()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId])

  const handleRemoveMember = async () => {
    if (!removeTarget) return
    try {
      await removeProjectMemberApi(projectId, removeTarget.id)
      showToast('Member removed', 'success')
      setRemoveTarget(null)
      loadDetails()
    } catch (err) {
      showToast(err.message, 'error')
    }
  }

  if (loading) {
    return (
      <PageContainer>
        <p className="text-slate-500">Loading members…</p>
      </PageContainer>
    )
  }

  if (error || !project) {
    return (
      <PageContainer>
        <Card className="p-6">
          <p className="text-red-600">{error || 'Project not found'}</p>
          <div className="mt-4">
            <Button onClick={() => navigate(`/projects/${projectId}`)}>Back to project</Button>
          </div>
        </Card>
      </PageContainer>
    )
  }

  return (
    <PageContainer title={`${project.name} - Members`}>
      <div className="flex flex-col gap-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(`/projects/${projectId}`)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Project
            </button>
            <div>
              <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                <Users className="w-6 h-6" />
                Project Members
              </h1>
              <p className="text-sm text-slate-500 mt-1">{project.name}</p>
            </div>
          </div>

          {canManage && (
            <Button className="gap-2" onClick={() => setOpenAdd(true)}>
              <UserPlus className="w-4 h-4" />
              Add Member
            </Button>
          )}
        </div>

        {/* Members Stats */}
        <Card className="p-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-slate-900 text-white flex items-center justify-center">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-slate-500">Total Members</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">{members.length}</p>
            </div>
          </div>
        </Card>

        {/* Members List */}
        <div className="space-y-3">
          {members.length === 0 ? (
            <Card className="p-12 text-center">
              <Users className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-500 text-lg">No members yet</p>
              <p className="text-sm text-slate-400 mt-2">Add members to collaborate on this project</p>
            </Card>
          ) : (
            members.map((member) => (
              <MemberCard
                key={member.id}
                member={member}
                canManage={canManage}
                onRemove={setRemoveTarget}
              />
            ))
          )}
        </div>
      </div>

      {/* Add Member Modal */}
      <AddMemberModal
        open={openAdd}
        onClose={() => setOpenAdd(false)}
        projectId={projectId}
        onAdded={loadDetails}
      />

      {/* Remove Member Modal */}
      <Modal
        open={!!removeTarget}
        onClose={() => setRemoveTarget(null)}
        title="Remove Member"
      >
        <p className="text-slate-700 dark:text-slate-300 mb-6">
          Are you sure you want to remove <strong>{removeTarget?.name || removeTarget?.email}</strong> from this project?
        </p>
        <div className="flex justify-end gap-3">
          <Button variant="secondary" onClick={() => setRemoveTarget(null)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleRemoveMember}>
            Remove
          </Button>
        </div>
      </Modal>
    </PageContainer>
  )
}
