import { useAuth } from './hooks/useAuth'
import { ChatProviderComponent } from './context/ChatProvider'
import AppRoutes from './routes/AppRoutes'
import { getAccessToken } from './api/axios'

export default function App() {
  const { user } = useAuth()
  const accessToken = getAccessToken()

  console.log('🚀 App.jsx - user:', !!user, 'accessToken:', !!accessToken)

  return (
    <ChatProviderComponent accessToken={accessToken}>
      <AppRoutes />
    </ChatProviderComponent>
  )
}
