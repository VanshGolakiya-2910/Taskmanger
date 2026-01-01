export default function Button({
  children,
  variant = 'primary',
  className = '',
  ...props
}) {
  const variants = {
    primary: {
      bg: '#0f172a',
      hover: '#1e293b',
      text: '#ffffff',
    },
    secondary: {
      bg: 'var(--bg-secondary)',
      hover: 'var(--bg-tertiary)',
      text: 'var(--text-primary)',
      border: 'var(--border-color)',
    },
    danger: {
      bg: '#dc2626',
      hover: '#b91c1c',
      text: '#ffffff',
    },
    ghost: {
      bg: 'transparent',
      hover: 'var(--bg-tertiary)',
      text: 'var(--text-primary)',
    },
  }

  const variantStyle = variants[variant]

  return (
    <button
      style={{
        backgroundColor: variantStyle.bg,
        color: variantStyle.text,
        borderColor: variantStyle.border,
      }}
      onMouseEnter={(e) => {
        e.target.style.backgroundColor = variantStyle.hover
      }}
      onMouseLeave={(e) => {
        e.target.style.backgroundColor = variantStyle.bg
      }}
      className={`
        inline-flex items-center justify-center
        px-6 py-2.5
        rounded-lg
        text-sm font-medium
        transition-colors
        disabled:opacity-50 disabled:cursor-not-allowed
        ${variant === 'secondary' ? 'border' : ''}
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  )
}
