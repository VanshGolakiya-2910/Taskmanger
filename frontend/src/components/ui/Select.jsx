export default function Select({ className = '', style = {}, ...props }) {
  return (
    <select
      style={{
        backgroundColor: 'var(--input-bg)',
        borderColor: 'var(--input-border)',
        color: 'var(--text-primary)',
        ...style,
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