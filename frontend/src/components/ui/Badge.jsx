export default function Badge({ children, color = 'slate' }) {
  const vars = {
    slate: {
      bg: 'var(--badge-slate-bg)',
      text: 'var(--badge-slate-text)',
    },
    blue: {
      bg: 'var(--badge-blue-bg)',
      text: 'var(--badge-blue-text)',
    },
    amber: {
      bg: 'var(--badge-amber-bg)',
      text: 'var(--badge-amber-text)',
    },
    red: {
      bg: 'var(--badge-red-bg)',
      text: 'var(--badge-red-text)',
    },
    green: {
      bg: 'var(--badge-green-bg)',
      text: 'var(--badge-green-text)',
    },
    purple: {
      bg: 'var(--badge-purple-bg)',
      text: 'var(--badge-purple-text)',
    },
  }

  const palette = vars[color] || vars.slate

  return (
    <span
      style={{ backgroundColor: palette.bg, color: palette.text }}
      className={`
        inline-flex items-center
        px-2.5 py-1
        rounded-full
        text-xs font-medium
      `}
    >
      {children}
    </span>
  )
}
