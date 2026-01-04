import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Folder, Users, ListTodo, ArrowUpRight } from 'lucide-react'
import { createProjectApi, getMyProjectsApi } from '../../api/project.api'
import PageContainer from '../../components/layout/PageContainer'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Modal from '../../components/ui/Modal'
import Input from '../../components/ui/Input'
import { useAuth } from '../../hooks/useAuth'
import { useToast } from '../../hooks/useToast'
import { canCreateProject } from '../../utils/permissions'
import { usePageTitle } from '../../hooks/usePageTitle'

export default function ProjectList() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { showToast } = useToast()

  usePageTitle('Projects')

  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [createOpen, setCreateOpen] = useState(false)
  const [creating, setCreating] = useState(false)
  const [projectName, setProjectName] = useState('')

  useEffect(() => {
    let mounted = true

    ;(async () => {
      try {
        const { data } = await getMyProjectsApi()
        if (mounted) setProjects(data.data || [])
      } catch {
        if (mounted) setError('Failed to load projects')
      } finally {
        if (mounted) setLoading(false)
      }
    })()

    return () => {
      mounted = false
    }
  }, [])

  /* ------------------ States ------------------ */

  const handleCreateProject = async (e) => {
    e.preventDefault()

    if (!projectName.trim()) {
      showToast('Please enter a project name.', 'error')
      return
    }

    setCreating(true)
    try {
      const { data } = await createProjectApi({ name: projectName.trim() })
      setProjects((prev) => [data.data, ...prev])
      showToast('Project created')
      setProjectName('')
      setCreateOpen(false)
    } catch (err) {
      const message = err?.response?.data?.message || 'Could not create project. Please try again.'
      showToast(message, 'error')
    } finally {
      setCreating(false)
    }
  }

  if (loading) {
    return (
      <PageContainer>
        <p className="text-slate-500">Loading projects…</p>
      </PageContainer>
    )
  }

  if (error) {
    return (
      <PageContainer>
        <p className="text-red-600">{error}</p>
      </PageContainer>
    )
  }

  /* ------------------ Render ------------------ */

  return (
    <PageContainer>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">
          Projects
        </h1>

        {canCreateProject(user) && (
          <Button onClick={() => setCreateOpen(true)}>
            Create Project
          </Button>
        )}
      </div>

      {projects.length === 0 ? (
        <Card className="p-8 text-center">
          <p className="text-slate-500">
            No projects found.
          </p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <Card
              key={project.id}
              role="button"
              tabIndex={0}
              onClick={() => navigate(`/projects/${project.id}`)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  navigate(`/projects/${project.id}`)
                }
              }}
              className="
                group
                p-6
                cursor-pointer
                focus:outline-none
                focus:ring-2 focus:ring-blue-500/50
                hover:shadow-lg
                hover:scale-[1.02]
                hover:border-blue-500
                transition-all
                duration-200
              "
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-lg bg-slate-900 dark:bg-slate-800 flex items-center justify-center group-hover:bg-blue-600 transition-colors duration-200">
                  <Folder className="w-6 h-6 text-white" />
                </div>
                <ArrowUpRight className="w-5 h-5 text-slate-400 group-hover:text-blue-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-200" />
              </div>

              <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
                {project.name}
              </h2>

              <p className="text-sm text-slate-500 mb-4">
                ID: #{project.id}
              </p>

              <div className="flex items-center gap-4 pt-3 border-t border-slate-200 dark:border-slate-700">
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <Users className="w-4 h-4" />
                  <span>Team</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <ListTodo className="w-4 h-4" />
                  <span>Tasks</span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <CreateProjectModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onSubmit={handleCreateProject}
        value={projectName}
        onChange={setProjectName}
        loading={creating}
      />
    </PageContainer>
  )
}

/* ------------------ CREATE PROJECT MODAL ------------------ */

function CreateProjectModal({ open, onClose, onSubmit, value, onChange, loading }) {
  return (
    <Modal open={open} onClose={onClose}>
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Create Project</h2>
          <p className="text-sm text-slate-500 mt-1">
            Managers and project managers can create new projects.
          </p>
        </div>

        <div>
          <label className="text-sm font-medium text-slate-700 dark:text-slate-200">
            Project Name
          </label>
          <Input
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="e.g. Website Redesign"
            autoFocus
            disabled={loading}
          />
        </div>

        <div className="flex justify-end gap-3">
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? 'Creating…' : 'Create'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
