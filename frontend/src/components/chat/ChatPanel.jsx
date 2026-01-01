import { useState } from 'react'
import { MessageCircle, X } from 'lucide-react'
import { useChat } from '../../hooks/useChat'
import ChatWindow from './ChatWindow'
import Button from '../ui/Button'

export default function ChatPanel({ isOpenProp = null, onCloseProp = null }) {
  const { activeProjectId } = useChat()
  const [isOpenState, setIsOpenState] = useState(false)
  
  // Use prop if provided (for inline usage), otherwise use internal state (for floating button)
  const isOpen = isOpenProp !== null ? isOpenProp : isOpenState
  const setIsOpen = onCloseProp !== null ? onCloseProp : setIsOpenState

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
        <div className="fixed bottom-6 right-6 w-96 h-150 rounded-lg shadow-2xl overflow-hidden bg-white dark:bg-slate-900 z-50">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-800 bg-blue-500 text-white">
            <h3 className="font-semibold">Project Chat</h3>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 hover:bg-blue-600 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Chat window */}
          <ChatWindow />
        </div>
      )}
    </>
  )
}
