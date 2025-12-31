import api from './axios'

export const addCommentApi = (taskId, payload) =>
  api.post(`/comments/task/${taskId}`, payload)

export const getTaskCommentsApi = (projectId, taskId) =>
  api.get(`/comments/projects/${projectId}/tasks/${taskId}/comments`)
    