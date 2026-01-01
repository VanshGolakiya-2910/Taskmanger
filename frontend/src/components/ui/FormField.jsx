export default function FormField({ label, hint, required, children, description, className = '' }) {
  return (
    <div className={`space-y-2 ${className}`}>
      {(label || hint) && (
        <div className="flex items-center justify-between">
          {label && (
            <label className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
              {label}
              {required ? <span className="text-red-500"> *</span> : null}
            </label>
          )}
          {hint && (
            <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>
              {hint}
            </span>
          )}
        </div>
      )}

      {children}

      {description && (
        <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
          {description}
        </p>
      )}
    </div>
  )
}