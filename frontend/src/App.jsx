import { useAuth } from './hooks/useAuth'
import { ChatProviderComponent } from './context/ChatProvider'
import AppRoutes from './routes/AppRoutes'

export default function App() {
  const { user } = useAuth()

  return (
    <ChatProviderComponent accessToken={user?.accessToken}>
      <AppRoutes />
    </ChatProviderComponent>
  )
}
