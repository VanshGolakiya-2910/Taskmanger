export default function Input({ className = '', ...props }) {
  return (
    <input
      style={{
        borderColor: 'var(--input-border)',
        backgroundColor: 'var(--input-bg)',
        color: 'var(--text-primary)',
      }}
      className={`
        w-full
        rounded-lg
        border
        px-3 py-2.5
        text-sm
        shadow-sm
        focus:outline-none focus:ring-2 focus:ring-slate-900/50
        disabled:opacity-50 disabled:cursor-not-allowed
        ${className}
      `}
      {...props}
    />
  )
}
