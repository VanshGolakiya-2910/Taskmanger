import api from './axios'

export const addCommentApi = (projectId, taskId, payload) =>
  api.post(`/comments/projects/${projectId}/tasks/${taskId}`, payload)

export const getTaskCommentsApi = (projectId, taskId) =>
  api.get(`/comments/projects/${projectId}/tasks/${taskId}`)
    