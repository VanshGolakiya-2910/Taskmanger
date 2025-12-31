import { useEffect, useState } from 'react'
import { getMyProjectsApi } from '../../api/project.api'
import PageContainer from '../../components/layout/PageContainer'

export default function ProjectList() {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    (async () => {
      try {
        const { data } = await getMyProjectsApi()
        setProjects(data.data)
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  if (loading) {
    return (
      <PageContainer>
        <p className="text-slate-500">Loading projects...</p>
      </PageContainer>
    )
  }

  return (
    <PageContainer>
      <h1 className="text-2xl font-semibold mb-6 text-slate-900 dark:text-white">
        Projects
      </h1>

      {projects.length === 0 ? (
        <p className="text-slate-500">No projects found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <div
              key={project.id}
              className="bg-white dark:bg-slate-800 
                         border border-slate-200 dark:border-slate-700
                         rounded-xl p-6 shadow-sm"
            >
              <h2 className="text-lg font-medium text-slate-900 dark:text-white">
                {project.name}
              </h2>
            </div>
          ))}
        </div>
      )}
    </PageContainer>
  )
}
