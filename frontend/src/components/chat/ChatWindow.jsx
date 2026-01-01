import { useState, useEffect, useRef } from 'react'
import { Send, Loader } from 'lucide-react'
import { useChat } from '../../hooks/useChat'
import { useAuth } from '../../hooks/useAuth'
import Button from '../../components/ui/Button'
import Card from '../../components/ui/Card'

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
      <div className="flex items-center justify-center h-full bg-slate-50 dark:bg-slate-900">
        <div className="text-center">
          <Loader className="w-8 h-8 animate-spin text-slate-400 mx-auto mb-3" />
          <p className="text-slate-600 dark:text-slate-300">Connecting...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full bg-white dark:bg-slate-900">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-slate-500">
            <p>No messages yet. Start a conversation!</p>
          </div>
        ) : (
          messages.map((msg, idx) => {
            const isOwnMessage = msg.userId === user.id
            return (
              <div key={idx} className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}>
                <Card
                  className={`max-w-xs lg:max-w-md px-4 py-2 ${
                    isOwnMessage
                      ? 'bg-blue-500 text-white rounded-lg rounded-tr-none'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg rounded-tl-none'
                  }`}
                >
                  {!isOwnMessage && (
                    <p className="text-xs font-semibold mb-1 opacity-75">
                      {msg.userName}
                    </p>
                  )}
                  <p className="text-sm break-words">{msg.content}</p>
                  <p className="text-xs mt-1 opacity-70">
                    {new Date(msg.timestamp).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </Card>
              </div>
            )
          })
        )}

        {/* Typing indicator */}
        {Object.keys(typingUsers).length > 0 && (
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <span>{Object.values(typingUsers).join(', ')}</span>
            <span className="flex gap-1">
              <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" />
              <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
              <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
            </span>
            <span>is typing</span>
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
