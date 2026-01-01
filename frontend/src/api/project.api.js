import api from './axios'

export const getMyProjectsApi = () =>
  api.get('/projects/my')

export const getProjectByIdApi = (projectId) =>
  api.get(`/projects/${projectId}`)

export const getProjectDetailsApi = (projectId) =>
  api.get(`/projects/${projectId}`)

export const createProjectApi = (payload) =>
  api.post('/projects', payload)

export const getProjectMembersApi = (projectId) =>
  api.get(`/projects/${projectId}/members`)

export const addProjectMemberApi = (projectId, payload) =>
  api.post(`/projects/${projectId}/members`, payload)

export const removeProjectMemberApi = (projectId, userId) =>
  api.delete(`/projects/${projectId}/members/${userId}`)

export const transferProjectOwnershipApi = (projectId, payload) =>
  api.post(`/projects/${projectId}/transfer`, payload)
