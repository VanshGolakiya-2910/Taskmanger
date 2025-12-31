export default function Button({
  children,
  variant = 'primary',
  className = '',
  ...props
}) {
  const variants = {
    primary:
      'bg-slate-900 hover:bg-slate-800 text-white',
    secondary:
      'bg-white hover:bg-slate-50 text-slate-900 border border-slate-300',
    danger:
      'bg-red-600 hover:bg-red-700 text-white',
    ghost:
      'hover:bg-slate-100 text-slate-700 dark:text-slate-300',
  }

  return (
    <button
      className={`
        inline-flex items-center justify-center
        px-6 py-2.5
        rounded-lg
        text-sm font-medium
        transition-colors
        disabled:opacity-50 disabled:cursor-not-allowed
        ${variants[variant]}
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  )
}
