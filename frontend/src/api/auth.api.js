import api from './axios'

export const loginApi = (payload) =>
  api.post('/auth/login', payload)

export const getMeApi = () =>
  api.get('/users/me')

export const logoutApi = () =>
  api.post('/auth/logout')
