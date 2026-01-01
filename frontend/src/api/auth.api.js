import api from './axios'

export const loginApi = (payload) =>
  api.post('/auth/login', payload)

export const getMeApi = () =>
  api.get('/users/me')

export const logoutApi = () =>
  api.post('/auth/logout')

// Only managers can create users
export const createUserApi = (payload) =>
  api.post('/users/create', payload)

export const updateProfileApi = (payload) =>
  api.put('/users/me', payload)
