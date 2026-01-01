import { TASK_STATUSES } from '../../../utils/constant'
import Button from '../../../components/ui/Button'

export default function StatusPicker({ current, onChange }) {
  return (
    <div className="flex flex-wrap gap-2">
      {TASK_STATUSES.map((s) => (
        <Button
          key={s.key}
          variant={s.key === current ? 'primary' : 'ghost'}
          className="px-3 py-1.5 text-xs"
          onClick={() => onChange(s.key)}
          disabled={s.key === current}
        >
          {s.label}
        </Button>
      ))}
    </div>
  )
}
