const baseClasses = `
  w-full
  rounded-lg
  border border-slate-200 dark:border-slate-700
  bg-white dark:bg-slate-900
  px-3 py-2.5
  text-sm text-slate-900 dark:text-white
  shadow-sm
  focus:outline-none focus:ring-2 focus:ring-slate-900/50
  disabled:opacity-50 disabled:cursor-not-allowed
`

export default function Input({ className = '', ...props }) {
  return <input className={`${baseClasses} ${className}`} {...props} />
}
