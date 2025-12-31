import api from './axios'

export const getMyProjectsApi = () =>
  api.get('/projects/my')

export const getProjectByIdApi = (projectId) =>
  api.get(`/projects/${projectId}`)

export const createProjectApi = (payload) =>
  api.post('/projects', payload)

export const getProjectMembersApi = (projectId) =>
  api.get(`/projects/${projectId}/members`)
