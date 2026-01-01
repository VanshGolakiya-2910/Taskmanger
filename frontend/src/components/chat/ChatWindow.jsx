import { useState, useEffect, useRef } from 'react'
import { Send, Loader } from 'lucide-react'
import { useChat } from '../../hooks/useChat'
import { useAuth } from '../../hooks/useAuth'
import Button from '../../components/ui/Button'

const Avatar = ({ name }) => {
  const initials = (name || 'U')
    .split(' ')
    .map(word => word[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  return (
    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-xs font-semibold flex-shrink-0">
      {initials}
    </div>
  )
}

export default function ChatWindow() {
  const { user } = useAuth()
  const { messages, typingUsers, addMessage, setTyping, isConnected } = useChat()
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef(null)
  const typingTimeoutRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleInputChange = (e) => {
    setInput(e.target.value)

    // Send typing indicator
    if (!isTyping) {
      setIsTyping(true)
      setTyping(true)
    }

    // Clear previous timeout
    clearTimeout(typingTimeoutRef.current)

    // Stop typing after 2 seconds of inactivity
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false)
      setTyping(false)
    }, 2000)
  }

  const handleSendMessage = (e) => {
    e.preventDefault()

    if (!input.trim() || !isConnected) return

    addMessage({
      userId: user.id,
      userName: user.name || user.email,
      content: input.trim(),
    })

    setInput('')
    setIsTyping(false)
    setTyping(false)
    clearTimeout(typingTimeoutRef.current)
  }

  if (!isConnected) {
    return (
      <div style={{ backgroundColor: 'var(--bg-primary)' }} className="flex items-center justify-center h-full">
        <div className="text-center">
          <Loader className="w-8 h-8 animate-spin text-slate-400 mx-auto mb-3" />
          <p style={{ color: 'var(--text-secondary)' }}>Connecting...</p>
        </div>
      </div>
    )
  }

  return (
    <div style={{ backgroundColor: 'var(--bg-secondary)' }} className="flex flex-col h-full">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.length === 0 ? (
          <div style={{ color: 'var(--text-secondary)' }} className="flex items-center justify-center h-full">
            <div className="text-center">
              <div style={{ backgroundColor: 'var(--bg-tertiary)' }} className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                <Send className="w-8 h-8 text-slate-400" />
              </div>
              <p style={{ color: 'var(--text-primary)' }} className="font-medium">No messages yet</p>
              <p style={{ color: 'var(--text-secondary)' }} className="text-sm mt-1">Start a conversation!</p>
            </div>
          </div>
        ) : (
          messages.map((msg, idx) => {
            const isOwnMessage = msg.userId === user.id
            return (
              <div key={idx} className={`flex gap-2 ${isOwnMessage ? 'flex-row-reverse' : 'flex-row'}`}>
                {!isOwnMessage && <Avatar name={msg.userName} />}
                <div className={`flex flex-col ${isOwnMessage ? 'items-end' : 'items-start'} max-w-xs lg:max-w-md`}>
                  {!isOwnMessage && (
                    <span style={{ color: 'var(--text-secondary)' }} className="text-xs font-medium mb-1 px-1">
                      {msg.userName}
                    </span>
                  )}
                  <div
                    style={{
                      backgroundColor: isOwnMessage ? 'var(--message-self-bg)' : 'var(--message-other-bg)',
                      color: isOwnMessage ? 'var(--message-self-text)' : 'var(--message-other-text)',
                    }}
                    className={`px-4 py-2 rounded-2xl ${
                      isOwnMessage ? 'rounded-tr-md' : 'rounded-tl-md'
                    }`}
                  >
                    <p className="text-sm break-words">{msg.content}</p>
                  </div>
                  <span style={{ color: 'var(--text-secondary)' }} className="text-xs mt-1 px-1">
                    {new Date(msg.timestamp).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
                {isOwnMessage && <Avatar name={user.name || user.email} />}
              </div>
            )
          })
        )}

        {/* Typing indicator */}
        {Object.keys(typingUsers).length > 0 && (
          <div className="flex items-center gap-2 px-2">
            <div className="flex gap-1 px-3 py-2 bg-slate-100 dark:bg-slate-800 rounded-2xl">
              <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" />
              <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
              <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
            </div>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              {Object.values(typingUsers).join(', ')} {Object.keys(typingUsers).length === 1 ? 'is' : 'are'} typing
            </span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="border-t border-slate-200 dark:border-slate-800 p-4">
        <form onSubmit={handleSendMessage} className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={handleInputChange}
            placeholder="Type a message..."
            className="flex-1 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-4 py-2.5 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Button
            type="submit"
            disabled={!input.trim() || !isConnected}
            className="px-4 py-2.5"
          >
            <Send className="w-5 h-5" />
          </Button>
        </form>
      </div>
    </div>
  )
}
