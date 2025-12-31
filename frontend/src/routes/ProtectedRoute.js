import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/auth.context'
import ProjectList from '../pages/projects/ProjectList'

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()

  if (loading) return null
  if (!user) return <Navigate to="/login" />
        
  return children


}
