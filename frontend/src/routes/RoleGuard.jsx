import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/auth.context'

export default function RoleGuard({ allowedRoles, children }) {
  const { user } = useAuth()

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" />
  }

  return children
}
