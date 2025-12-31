import api from './axios'

export const getProjectTasksApi = (projectId) =>
  api.get(`/tasks/project/${projectId}`)

export const createTaskApi = (projectId, payload) =>
  api.post(`/tasks/project/${projectId}`, payload)

export const updateTaskStatusApi = (projectId, taskId, status) =>
  api.patch(`/tasks/project/${projectId}/${taskId}/status`, { status })

export const getMyTasksApi = (projectId) =>
  api.get(`/tasks/project/${projectId}/my`)
