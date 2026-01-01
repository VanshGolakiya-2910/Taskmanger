export default function SectionHeader({ title, action, subtitle, className = '' }) {
  return (
    <div className={`flex items-center justify-between gap-3 mb-4 ${className}`}>
      <div className="min-w-0">
        <h2 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
          {title}
        </h2>
        {subtitle && (
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            {subtitle}
          </p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  )
}