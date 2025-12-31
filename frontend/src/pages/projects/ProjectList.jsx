import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getMyProjectsApi } from '../../api/project.api'
import PageContainer from '../../components/layout/PageContainer'
import Card from '../../components/ui/Card'

export default function ProjectList() {
  const navigate = useNavigate()

  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

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
                p-6
                cursor-pointer
                focus:outline-none
                focus:ring-2 focus:ring-slate-900/10
              "
            >
              <h2 className="text-lg font-medium text-slate-900 dark:text-white">
                {project.name}
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Project ID: {project.id}
              </p>
            </Card>
          ))}
        </div>
      )}
    </PageContainer>
  )
}
