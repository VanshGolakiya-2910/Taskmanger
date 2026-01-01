import { useAuth } from './hooks/useAuth'
import { ChatProviderComponent } from './context/ChatProvider'
import AppRoutes from './routes/AppRoutes'
import { getAccessToken } from './api/axios'

export default function App() {
  const { user } = useAuth()
  const accessToken = getAccessToken()

  return (
    <ChatProviderComponent accessToken={accessToken}>
      <AppRoutes />
    </ChatProviderComponent>
  )
}
