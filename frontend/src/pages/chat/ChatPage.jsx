import { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import PageContainer from '../../components/layout/PageContainer'
import ChatWindow from '../../components/chat/ChatWindow'
import Button from '../../components/ui/Button'
import { useChat } from '../../hooks/useChat'
import { usePageTitle } from '../../hooks/usePageTitle'

export default function ChatPage() {
  const { projectId } = useParams()
  const navigate = useNavigate()
  const { switchProject } = useChat()

  usePageTitle(projectId ? `Project ${projectId} Chat` : 'Project Chat')

  useEffect(() => {
    if (projectId) {
      switchProject(projectId)
    }
  }, [projectId, switchProject])

  return (
    <PageContainer title="Project Chat">
      <div className="flex flex-col h-[calc(100vh-12rem)]">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => navigate(`/projects/${projectId}`)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Project
          </button>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Project Chat</h1>
        </div>

        {/* Chat Window - Full height */}
        <div className="flex-1 bg-white dark:bg-slate-900 rounded-lg shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
          <ChatWindow />
        </div>
      </div>
    </PageContainer>
  )
}
