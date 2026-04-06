import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true, // required for refresh cookies; keep backend CORS allowlist in sync
})

let accessToken = null

export const setAccessToken = (token) => {
  accessToken = token
}

export const getAccessToken = () => accessToken

api.interceptors.request.use((config) => {
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`
  }
  return config
})

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config

    // Only retry if it's a 401, not already retried, has a token to refresh with, and not a refresh/login request
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      accessToken && // Only retry if we have a stored token (means user was logged in)
      !originalRequest.url?.includes('/auth/refresh') &&
      !originalRequest.url?.includes('/auth/login') &&
      !originalRequest.url?.includes('/auth/register')
    ) {
      originalRequest._retry = true
      try {
        const { data } = await api.post('/auth/refresh')
        setAccessToken(data.data.accessToken)
        originalRequest.headers.Authorization = `Bearer ${data.data.accessToken}`
        return api(originalRequest)
      } catch {
        // If refresh fails, redirect to login
        setAccessToken(null)
        window.location.href = '/login'
      }
    }

    return Promise.reject(error)
  }
)

export default api
