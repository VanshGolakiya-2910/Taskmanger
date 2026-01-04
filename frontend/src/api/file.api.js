import api from './axios'

export const uploadFileApi = (projectId, file, taskId = null) => {
  const formData = new FormData()
  formData.append('file', file)
  const url = taskId 
    ? `/files/projects/${projectId}/tasks/${taskId}/upload`
    : `/files/projects/${projectId}/upload`
  return api.post(url, formData)
}

export const deleteFileApi = (fileId) =>
  api.delete(`/files/${fileId}`)

export const getProjectFilesApi = (projectId) =>
  api.get(`/files/projects/${projectId}`)

export const getTaskFilesApi = (projectId, taskId) =>
  api.get(`/files/projects/${projectId}/tasks/${taskId}`)

export const downloadFileApi = (fileId) => {
  return api.get(`/files/${fileId}/download`, {
    responseType: 'blob'
  })
}
