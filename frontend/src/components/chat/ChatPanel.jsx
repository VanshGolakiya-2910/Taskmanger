import { useState } from 'react'
import { MessageCircle, X, Maximize2, Minimize2, ExternalLink } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useChat } from '../../hooks/useChat'
import ChatWindow from './ChatWindow'
import Button from '../ui/Button'

export default function ChatPanel({ isOpenProp = null, onCloseProp = null }) {
  const { activeProjectId } = useChat()
  const navigate = useNavigate()
  const [isOpenState, setIsOpenState] = useState(false)
  const [isMaximized, setIsMaximized] = useState(false)
  
  // Use prop if provided (for inline usage), otherwise use internal state (for floating button)
  const isOpen = isOpenProp !== null ? isOpenProp : isOpenState
  const setIsOpen = onCloseProp !== null ? onCloseProp : setIsOpenState

  const handleMaximize = () => setIsMaximized(!isMaximized)
  
  const handleOpenFullPage = () => {
    navigate(`/projects/${activeProjectId}/chat`)
  }

  if (!activeProjectId) {
    return null
  }

  return (
    <>
      {/* Floating button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-blue-500 hover:bg-blue-600 text-white shadow-lg flex items-center justify-center transition-all z-40"
        >
          <MessageCircle className="w-6 h-6" />
        </button>
      )}

      {/* Chat panel */}
      {isOpen && (
        <div className={`fixed rounded-lg shadow-2xl bg-white dark:bg-slate-900 z-50 transition-all flex flex-col ${
          isMaximized 
            ? 'inset-4' 
            : 'bottom-6 right-6 w-96 h-[75vh] max-h-[700px]'
        }`}>
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-800 bg-blue-500 text-white flex-shrink-0">
            <h3 className="font-semibold">Project Chat</h3>
            <div className="flex items-center gap-2">
              <button
                onClick={handleMaximize}
                className="p-1 hover:bg-blue-600 rounded-lg transition-colors"
                title={isMaximized ? 'Minimize' : 'Maximize'}
              >
                {isMaximized ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
              </button>
              <button
                onClick={handleOpenFullPage}
                className="p-1 hover:bg-blue-600 rounded-lg transition-colors"
                title="Open in full page"
              >
                <ExternalLink className="w-5 h-5" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-blue-600 rounded-lg transition-colors"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Chat window */}
          <div className="flex-1 overflow-hidden">
            <ChatWindow />
          </div>
        </div>
      )}
    </>
  )
}
