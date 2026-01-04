import { useMemo, useState } from 'react'
import { ChevronDown, ArrowUpRight } from 'lucide-react'
import Button from '../../../components/ui/Button'
import Badge from '../../../components/ui/Badge'
import { TASK_STATUSES } from '../../../utils/constant'

export default function TaskListByDueDate({ 
  tasks, 
  projectId, 
  navigate,
  excludeStatuses = [],
  itemsPerPage = 5
}) {
  const [showAll, setShowAll] = useState(false)

  // Filter and sort tasks
  const filteredTasks = useMemo(() => {
    return tasks
      .filter((task) => !excludeStatuses.includes(task.status))
      .slice()
      .sort((a, b) => {
        const aDate = a.due_date || a.dueDate
        const bDate = b.due_date || b.dueDate

        if (!aDate && !bDate) return 0
        if (!aDate) return 1
        if (!bDate) return -1

        return new Date(aDate) - new Date(bDate)
      })
  }, [tasks, excludeStatuses])

  const visibleTasks = showAll ? filteredTasks : filteredTasks.slice(0, itemsPerPage)
  const hasMoreTasks = filteredTasks.length > itemsPerPage

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-base font-semibold text-slate-900 dark:text-white">
          Tasks by due date
        </h3>
        <p className="text-xs text-slate-500">Soonest first</p>
      </div>

      <div className={`space-y-2 ${showAll ? 'max-h-96 overflow-y-auto pr-1 scroll-area' : ''}`}>
        {visibleTasks.length === 0 ? (
          <p className="text-sm text-slate-500 py-4 text-center">No tasks to display</p>
        ) : (
          visibleTasks.map((task) => {
          const statusMeta = TASK_STATUSES.find((s) => s.key === task.status) || {
            label: task.status || 'Unknown',
            color: 'slate',
          }

          const rawDue = task.due_date || task.dueDate
          const formattedDue = rawDue
            ? new Date(rawDue).toLocaleString(undefined, {
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })
            : 'No due date'

          return (
            <div
              key={task.id}
              className="flex items-center justify-between gap-3 p-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 cursor-pointer hover:bg-slate-100 hover:scale-[1.02] hover:shadow-md transition-all duration-200"
              onDoubleClick={() => navigate(`/projects/${projectId}/tasks/${task.id}`)}
            >
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-slate-900 dark:text-white truncate">
                  {task.title}
                </p>
                <p className="text-xs text-slate-500">Due {formattedDue}</p>
              </div>
              <div className="flex items-center gap-2">
                <Badge color={statusMeta.color}>{statusMeta.label}</Badge>
                <button
                  onClick={() => navigate(`/projects/${projectId}/tasks/${task.id}`)}
                  aria-label={`Open task ${task.title}`}
                  className="p-2 rounded-full text-slate-500 hover:text-white hover:bg-slate-800 dark:hover:bg-white/10 transition"
                >
                  <ArrowUpRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )
          })
        )}
      </div>

      {hasMoreTasks && (
        <div className="mt-3 flex justify-center">
          <Button
            variant="secondary"
            className="gap-2 hover:scale-105 transition-transform duration-200"
            onClick={() => setShowAll(!showAll)}
          >
            {showAll ? (
              <>Show Less</>
            ) : (
              <>
                <ChevronDown className="w-4 h-4" />
                Show More ({filteredTasks.length - itemsPerPage} more)
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  )
}
