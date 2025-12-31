import { useState } from 'react'
import Modal from '../../../components/ui/Modal'
import Button from '../../../components/ui/Button'
import Input from '../../../components/ui/Input'
import { createTaskApi } from '../../../api/task.api'

export default function CreateTaskModal({ open, onClose, projectId, onCreated }) {
  const [form, setForm] = useState({ title: '', description: '' })
  const [loading, setLoading] = useState(false)

  const submit = async () => {
    setLoading(true)
    await createTaskApi(projectId, form)
    onCreated()
    onClose()
    setLoading(false)
  }

  return (
    <Modal open={open} onClose={onClose}>
      <h2 className="text-lg font-semibold mb-4">Create Task</h2>

      <div className="space-y-4">
        <Input
          placeholder="Title"
          value={form.title}
          onChange={(e) =>
            setForm({ ...form, title: e.target.value })
          }
        />

        <Input
          placeholder="Description"
          value={form.description}
          onChange={(e) =>
            setForm({ ...form, description: e.target.value })
          }
        />
      </div>

      <div className="flex justify-end gap-3 mt-6">
        <Button variant="ghost" onClick={onClose}>
          Cancel
        </Button>
        <Button onClick={submit} disabled={loading}>
          Create
        </Button>
      </div>
    </Modal>
  )
}
