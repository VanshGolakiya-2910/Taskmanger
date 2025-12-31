import api from './axios'

export const uploadFileApi = (projectId, file) => {
  const formData = new FormData()
  formData.append('file', file)
  return api.post(`/files/projects/${projectId}/upload`, formData)
}

export const deleteFileApi = (fileId) =>
  api.delete(`/files/${fileId}`)
