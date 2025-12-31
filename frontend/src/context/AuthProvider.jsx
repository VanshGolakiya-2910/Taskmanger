import { useEffect, useState } from 'react'
import { AuthContext } from './auth.context'
import { loginApi, getMeApi, logoutApi } from '../api/auth.api'
import { setAccessToken } from '../api/axios'

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  const login = async (credentials) => {
    const { data } = await loginApi(credentials)
    setAccessToken(data.data.accessToken)

    const me = await getMeApi()
    setUser(me.data.data)
  }

  const logout = async () => {
    await logoutApi()
    setAccessToken(null)
    setUser(null)
    window.location.href = '/login'
  }

  useEffect(() => {
    (async () => {
      try {
        const me = await getMeApi()
        setUser(me.data.data)
      } catch {
        setUser(null)
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
