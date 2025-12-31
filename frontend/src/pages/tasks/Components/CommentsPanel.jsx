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
    await addCommentApi(taskId, { content })
    setContent('')
    const { data } = await getTaskCommentsApi(projectId, taskId)
    setComments(data.data)
  }

  if (loading) return <p className="text-slate-500">Loading comments…</p>

  return (
    <div className="space-y-3">
      <Card className="p-3 space-y-2">
        {comments.length === 0 ? (
          <p className="text-sm text-slate-500">No comments yet.</p>
        ) : (
          comments.map((c) => (
            <div key={c.id} className="text-sm">
              <span className="font-medium">{c.userEmail}</span>{' '}
              <span className="text-slate-500">{c.content}</span>
            </div>
          ))
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
