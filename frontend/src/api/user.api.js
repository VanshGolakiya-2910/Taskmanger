import api from './axios'

export const getAvailableUsersApi = async () => {
  const res = await api.get('/users/available')
  return res.data.data
}

export const updateUserProfileApi = async (data) => {
  const res = await api.put('/users/me', data)
  return res.data.data
}
