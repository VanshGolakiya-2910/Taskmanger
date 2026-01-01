export default function Card({ children, className = '', ...props }) {
  return (
    <div
      style={{
        backgroundColor: 'var(--card-bg)',
        borderColor: 'var(--card-border)',
      }}
      className={`
        border
        rounded-xl
        shadow-sm hover:shadow-md
        transition-shadow
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  )
}
