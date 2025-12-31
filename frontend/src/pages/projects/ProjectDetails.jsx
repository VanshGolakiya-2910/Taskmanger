import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import {
  getProjectByIdApi,
  getProjectMembersApi,
  removeProjectMemberApi,
} from '../../api/project.api'

import PageContainer from '../../components/layout/PageContainer'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Modal from '../../components/ui/Modal'

import { useAuth } from '../../hooks/useAuth'
import AddMemberModal from './components/AddMemberModal'
import FileUpload from './components/FileUpload'

export default function ProjectDetails() {
  const { projectId } = useParams()
  const { user } = useAuth()

  const [project, setProject] = useState(null)
  const [members, setMembers] = useState([])
  const [loading, setLoading] = useState(true)

  const [openAdd, setOpenAdd] = useState(false)
  const [removeTarget, setRemoveTarget] = useState(null)

  const canManage =
    user.role === 'manager' || user.role === 'project_manager'

  const loadData = async () => {
    setLoading(true)
    try {
      const [projectRes, membersRes] = await Promise.all([
        getProjectByIdApi(projectId),
        getProjectMembersApi(projectId),
      ])

      setProject(projectRes.data.data)
      setMembers(membersRes.data.data)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [projectId])

  const removeMember = async () => {
    if (!removeTarget) return
    await removeProjectMemberApi(projectId, removeTarget.id)
    setRemoveTarget(null)
    // Reload project data after removing member
    const [projectRes, membersRes] = await Promise.all([
      getProjectByIdApi(projectId),
      getProjectMembersApi(projectId),
    ])
    setProject(projectRes.data.data)
    setMembers(membersRes.data.data)
  }

  /* ------------------ States ------------------ */

  if (loading) {
    return (
      <PageContainer>
        <p className="text-slate-500">Loading project…</p>
      </PageContainer>
    )
  }

  /* ------------------ Render ------------------ */

  return (
    <PageContainer>
      {/* Project Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">
          {project.name}
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Project ID: {project.id}
        </p>
      </div>

      {/* Members Section */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-medium text-slate-900 dark:text-white">
            Members
          </h2>

          {canManage && (
            <Button onClick={() => setOpenAdd(true)}>
              Add Member
            </Button>
          )}
        </div>

        {members.length === 0 ? (
          <Card className="p-6 text-center">
            <p className="text-slate-500">
              No members in this project.
            </p>
          </Card>
        ) : (
          <div className="space-y-3">
            {members.map((member) => (
              <Card
                key={member.id}
                className="p-4 flex items-center justify-between"
              >
                <div>
                  <p className="font-medium text-slate-900 dark:text-white">
                    {member.email}
                  </p>
                  <p className="text-sm text-slate-500">
                    Role: {member.role}
                  </p>
                </div>

                {canManage && (
                  <Button
                    variant="danger"
                    className="px-3 py-1.5"
                    onClick={() => setRemoveTarget(member)}
                  >
                    Remove
                  </Button>
                )}
              </Card>
            ))}
          </div>
        )}
      </section>

      {/* Add Member Modal */}
      <AddMemberModal
        open={openAdd}
        onClose={() => setOpenAdd(false)}
        projectId={projectId}
        onAdded={loadData}
      />

      {/* Remove Member Confirmation */}
      <Modal
        open={Boolean(removeTarget)}
        onClose={() => setRemoveTarget(null)}
      >
        <h2 className="text-lg font-semibold mb-3">
          Remove member
        </h2>

        <p className="text-sm text-slate-600 mb-6">
          Are you sure you want to remove{' '}
          <span className="font-medium">
            {removeTarget?.email}
          </span>{' '}
          from this project?
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

      {/* Files Section */}
      <section className="mt-10">
        <h2 className="text-lg font-medium mb-4 text-slate-900 dark:text-white">
          Files
        </h2>

        <FileUpload
          projectId={projectId}
          onUploaded={loadData}
        />
      </section>
    </PageContainer>
  )
}
