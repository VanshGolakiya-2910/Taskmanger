import { createContext, useContext, useState } from 'react'

const ToastContext = createContext(null)

export function ToastProvider({ children }) {
  const [toast, setToast] = useState(null)

  const show = (message, type = 'success') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3000)
  }

  return (
    <ToastContext.Provider value={{ show }}>
      {children}
      {toast && (
        <div className="
          fixed bottom-6 right-6 z-50
          bg-white dark:bg-slate-800
          border border-slate-200 dark:border-slate-700
          rounded-lg shadow-lg
          px-4 py-3
          text-sm
        ">
          <span className={toast.type === 'error' ? 'text-red-600' : 'text-green-600'}>
            {toast.message}
          </span>
        </div>
      )}
    </ToastContext.Provider>
  )
}

export const useToast = () => useContext(ToastContext)
