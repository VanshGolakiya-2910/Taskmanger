import api from './axios'

export const getProjectTasksApi = (projectId) =>
  api.get(`/tasks/project/${projectId}`)

export const createTaskApi = (projectId, payload) =>
  api.post(`/tasks/project/${projectId}`, payload)

export const updateTaskStatusApi = (projectId, taskId, status) =>
  api.patch(`/tasks/project/${projectId}/${taskId}/status`, { status })

export const getMyTasksApi = (projectId) =>
  api.get(`/tasks/project/${projectId}/my`)

export const getTaskByIdApi = (projectId, taskId) =>
  api.get(`/tasks/project/${projectId}/${taskId}`)

export const deleteTaskApi = (projectId, taskId) =>
  api.delete(`/tasks/project/${projectId}/${taskId}`)
