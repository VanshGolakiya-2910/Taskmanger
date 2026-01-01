import { useState } from 'react'
import { ToastContext } from './toast.context'

export function ToastProvider({ children }) {
  const [toast, setToast] = useState(null)

  const showToast = (message, type = 'success') => {
    setToast({ message, type })

    setTimeout(() => {
      setToast(null)
    }, 3000)
  }

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      {toast && (
        <div
          style={{
            backgroundColor: 'var(--toast-bg)',
            borderColor: 'var(--toast-border)',
            color: 'var(--toast-text)',
          }}
          className="
            fixed bottom-6 right-6 z-50
            border
            rounded-lg shadow-lg
            px-4 py-3
            text-sm
          "
        >
          <span
            className={
              toast.type === 'error'
                ? 'text-red-600'
                : 'text-green-600'
            }
          >
            {toast.message}
          </span>
        </div>
      )}
    </ToastContext.Provider>
  )
}
