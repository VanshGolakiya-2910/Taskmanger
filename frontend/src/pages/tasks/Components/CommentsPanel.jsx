import { useEffect, useState } from 'react'
import Card from '../../../components/ui/Card'
import Button from '../../../components/ui/Button'
import Input from '../../../components/ui/Input'
import { addCommentApi, getTaskCommentsApi } from '../../../api/comment.api'

export default function CommentsPanel({ projectId, taskId }) {
  const [comments, setComments] = useState([])
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        const { data } = await getTaskCommentsApi(projectId, taskId)
        if (mounted) setComments(data.data)
      } finally {
        if (mounted) setLoading(false)
      }
    })()
    return () => (mounted = false)
  }, [projectId, taskId])

  const submit = async () => {
    if (!content.trim()) return
    await addCommentApi(projectId, taskId, { content })
    setContent('')
    const { data } = await getTaskCommentsApi(projectId, taskId)
    setComments(data.data)
  }

  if (loading) return <p className="text-slate-500">Loading comments…</p>

  return (
    <div className="space-y-3">
      <Card className="p-3 space-y-3">
        {comments.length === 0 ? (
          <p className="text-sm text-slate-500">No comments yet.</p>
        ) : (
          comments.map((c) => {
            const initials = (c.author || '??')
              .slice(0, 2)
              .toUpperCase()
            return (
              <div
                key={c.id}
                className="flex items-start gap-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 px-3 py-2"
              >
                <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs font-semibold">
                  {initials}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-900 dark:text-white">{c.userEmail}</p>
                  <p className="text-sm text-slate-600 dark:text-slate-300 mt-0.5 leading-relaxed">{c.content}</p>
                </div>
              </div>
            )
          })
        )}
      </Card>

      <div className="flex gap-2">
        <Input
          placeholder="Add a comment"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <Button onClick={submit}>Send</Button>
      </div>
    </div>
  )
}
