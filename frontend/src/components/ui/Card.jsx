export default function Card({ children, className = '', ...props }) {
  return (
    <div
      className={`
        bg-white dark:bg-slate-800
        border border-slate-200 dark:border-slate-700
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
