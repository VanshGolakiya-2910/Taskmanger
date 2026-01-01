export default function Modal({ open, onClose, children }) {
  if (!open) return null

  return (
    <>
      <div
        className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40"
        onClick={onClose}
      />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div 
          style={{
            backgroundColor: 'var(--card-bg)',
            borderColor: 'var(--card-border)',
          }}
          className="rounded-xl shadow-xl border max-w-lg w-full p-6"
        >
          {children}
        </div>
      </div>
    </>
  )
}
