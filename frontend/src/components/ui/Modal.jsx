export default function Modal({ open, onClose, children }) {
  if (!open) return null

  return (
    <>
      <div
        className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40"
        onClick={onClose}
      />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="
          bg-white dark:bg-slate-800
          rounded-xl shadow-xl
          border border-slate-200 dark:border-slate-700
          max-w-lg w-full p-6
        ">
          {children}
        </div>
      </div>
    </>
  )
}
